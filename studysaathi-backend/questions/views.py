from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Count
from .models import Question, Answer, Vote, Bookmark
from .serializers import (
    QuestionListSerializer, 
    QuestionDetailSerializer, 
    QuestionCreateSerializer,
    AnswerSerializer,
    AnswerCreateSerializer,
    VoteSerializer
)


class QuestionPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticatedOrReadOnly])
def question_list(request):
    """Get all questions or create new question"""
    
    if request.method == 'GET':
        questions = Question.objects.all()
        
        # Search
        search = request.query_params.get('search', None)
        if search:
            questions = questions.filter(
                Q(title__icontains=search) | 
                Q(content__icontains=search) |
                Q(tags__icontains=search) |
                Q(subject__icontains=search)
            )
        
        # Filter by faculty
        faculty = request.query_params.get('faculty', None)
        if faculty:
            questions = questions.filter(faculty=faculty)
        
        # Filter by semester
        semester = request.query_params.get('semester', None)
        if semester:
            questions = questions.filter(semester=semester)
        
        # Sort
        sort = request.query_params.get('sort', 'newest')
        if sort == 'trending' or sort == 'most-voted':
            questions = questions.annotate(vote_count=Count('votes')).order_by('-vote_count', '-created_at')
        elif sort == 'unanswered':
            questions = questions.annotate(answer_count=Count('answers')).filter(answer_count=0)
        else:  # newest
            questions = questions.order_by('-created_at')
        
        # Paginate
        paginator = QuestionPagination()
        page = paginator.paginate_queryset(questions, request)
        
        if page is not None:
            serializer = QuestionListSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = QuestionListSerializer(questions, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = QuestionCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            question = serializer.save()
            return Response(
                QuestionDetailSerializer(question).data, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticatedOrReadOnly])
def question_detail(request, pk):
    """Get, update or delete a question"""
    try:
        question = Question.objects.get(pk=pk)
    except Question.DoesNotExist:
        return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        # Increment views
        question.views += 1
        question.save(update_fields=['views'])
        
        serializer = QuestionDetailSerializer(question)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        if request.user != question.author:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = QuestionCreateSerializer(question, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(QuestionDetailSerializer(question).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        if request.user != question.author and not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        question.delete()
        return Response({'message': 'Question deleted'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_answer(request, question_id):
    """Create answer for a question"""
    try:
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = AnswerCreateSerializer(
        data=request.data, 
        context={'request': request, 'question_id': question_id}
    )
    if serializer.is_valid():
        answer = serializer.save()
        return Response(AnswerSerializer(answer).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def vote_question(request, pk):
    """Upvote/downvote a question"""
    try:
        question = Question.objects.get(pk=pk)
    except Question.DoesNotExist:
        return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
    
    vote_type = request.data.get('vote_type', 'upvote')
    
    # Check if user already voted
    existing_vote = Vote.objects.filter(user=request.user, question=question).first()
    
    if existing_vote:
        if existing_vote.vote_type == vote_type:
            # Remove vote if same type
            existing_vote.delete()
            return Response({'message': 'Vote removed'})
        else:
            # Change vote type
            existing_vote.vote_type = vote_type
            existing_vote.save()
            return Response({'message': 'Vote updated', 'vote_type': vote_type})
    else:
        # Create new vote
        Vote.objects.create(user=request.user, question=question, vote_type=vote_type)
        return Response({'message': 'Vote added', 'vote_type': vote_type}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def vote_answer(request, pk):
    """Upvote/downvote an answer"""
    try:
        answer = Answer.objects.get(pk=pk)
    except Answer.DoesNotExist:
        return Response({'error': 'Answer not found'}, status=status.HTTP_404_NOT_FOUND)
    
    vote_type = request.data.get('vote_type', 'upvote')
    
    existing_vote = Vote.objects.filter(user=request.user, answer=answer).first()
    
    if existing_vote:
        if existing_vote.vote_type == vote_type:
            existing_vote.delete()
            return Response({'message': 'Vote removed'})
        else:
            existing_vote.vote_type = vote_type
            existing_vote.save()
            return Response({'message': 'Vote updated', 'vote_type': vote_type})
    else:
        Vote.objects.create(user=request.user, answer=answer, vote_type=vote_type)
        return Response({'message': 'Vote added', 'vote_type': vote_type}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_answer(request, pk):
    """Accept an answer (only question author can do this)"""
    try:
        answer = Answer.objects.get(pk=pk)
    except Answer.DoesNotExist:
        return Response({'error': 'Answer not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.user != answer.question.author:
        return Response({'error': 'Only question author can accept answers'}, status=status.HTTP_403_FORBIDDEN)
    
    # Unaccept all other answers
    Answer.objects.filter(question=answer.question).update(is_accepted=False)
    
    # Accept this answer
    answer.is_accepted = True
    answer.save()
    
    return Response({'message': 'Answer accepted'})


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def bookmark_question(request, pk):
    """Bookmark or unbookmark a question"""
    try:
        question = Question.objects.get(pk=pk)
    except Question.DoesNotExist:
        return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'POST':
        bookmark, created = Bookmark.objects.get_or_create(user=request.user, question=question)
        if created:
            return Response({'message': 'Question bookmarked'}, status=status.HTTP_201_CREATED)
        return Response({'message': 'Already bookmarked'})
    
    elif request.method == 'DELETE':
        deleted = Bookmark.objects.filter(user=request.user, question=question).delete()
        if deleted[0] > 0:
            return Response({'message': 'Bookmark removed'})
        return Response({'error': 'Bookmark not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_questions(request):
    """Get current user's questions"""
    questions = Question.objects.filter(author=request.user)
    serializer = QuestionListSerializer(questions, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics for current user"""
    user = request.user
    
    stats = {
        'questions_count': Question.objects.filter(author=user).count(),
        'answers_count': Answer.objects.filter(author=user).count(),
        'total_upvotes': Vote.objects.filter(
            Q(question__author=user) | Q(answer__author=user),
            vote_type='upvote'
        ).count(),
        'reputation': user.reputation,
        'bookmarks_count': Bookmark.objects.filter(user=user).count(),
    }
    
    return Response(stats)