# questions/ai_views.py

import logging
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.contrib.auth import get_user_model

from .models import Question, Answer
from .serializers import AnswerSerializer
from .ai_service import StudySaathiAI

User = get_user_model()
logger = logging.getLogger(__name__)


def get_or_create_ai_bot():
    """
    Returns the AI bot User object.
    Creates it on first call with unusable password.
    Matches your custom User model fields exactly.
    """
    ai_bot, created = User.objects.get_or_create(
        email=settings.AI_BOT_EMAIL,
        defaults={
            'full_name': settings.AI_BOT_NAME,
            'faculty': 'CSIT',
            'semester': '1',
            'is_verified': True,
            'is_active': True,
        }
    )

    if created:
        # Nobody can login as AI bot
        ai_bot.set_unusable_password()
        ai_bot.save(update_fields=['password'])
        logger.info("🤖 AI bot user created successfully")

    return ai_bot


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_ai_answer(request, question_id):
    """
    Generate an AI answer for a question.
    
    If an AI answer already exists, return it (saves API calls).
    If not, generate a new one.
    
    POST /api/questions/<question_id>/ai-answer/
    """
    # Get question
    try:
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        return Response(
            {'error': 'Question not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Check if AI answer already exists - return it instead of regenerating
    existing = Answer.objects.filter(
        question=question,
        is_ai_generated=True
    ).first()

    if existing:
        return Response({
            'answer': AnswerSerializer(existing).data,
            'model_used': 'StudySaathi AI',
            'already_existed': True,
            'message': 'Returning existing AI answer'
        }, status=status.HTTP_200_OK)

    # Generate new AI answer
    ai_service = StudySaathiAI()
    answer_text, model_used, success = ai_service.generate_answer(
        title=question.title,
        content=question.content,
        faculty=question.faculty,
        semester=question.semester,
        subject=question.subject or '',
        tags=question.tags or []
    )

    if not success:
        return Response(
            {
                'error': (
                    'AI service is currently unavailable. '
                    'Please try again later or wait for community answers.'
                )
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    # Get AI bot user
    ai_bot = get_or_create_ai_bot()

    # Save AI answer to database
    answer = Answer.objects.create(
        question=question,
        author=ai_bot,
        content=answer_text,
        is_ai_generated=True,
        is_accepted=False,
    )

    logger.info(f"🤖 AI answer saved for question ID: {question_id}")

    return Response({
        'answer': AnswerSerializer(answer).data,
        'model_used': model_used,
        'already_existed': False,
        'message': 'AI answer generated successfully'
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def regenerate_ai_answer(request, question_id):
    """
    Delete existing AI answer and generate a fresh one.
    Useful when user wants a different explanation or approach.
    
    POST /api/questions/<question_id>/ai-answer/regenerate/
    """
    try:
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        return Response(
            {'error': 'Question not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Delete old AI answer
    deleted_count, _ = Answer.objects.filter(
        question=question,
        is_ai_generated=True
    ).delete()

    logger.info(f"🗑️ Deleted {deleted_count} existing AI answer(s) for question {question_id}")

    # Generate fresh answer
    ai_service = StudySaathiAI()
    answer_text, model_used, success = ai_service.generate_answer(
        title=question.title,
        content=question.content,
        faculty=question.faculty,
        semester=question.semester,
        subject=question.subject or '',
        tags=question.tags or []
    )

    if not success:
        return Response(
            {'error': 'AI service is currently unavailable. Please try again later.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    ai_bot = get_or_create_ai_bot()

    answer = Answer.objects.create(
        question=question,
        author=ai_bot,
        content=answer_text,
        is_ai_generated=True,
        is_accepted=False,
    )

    return Response({
        'answer': AnswerSerializer(answer).data,
        'model_used': model_used,
        'already_existed': False,
        'message': 'AI answer regenerated successfully'
    }, status=status.HTTP_201_CREATED)