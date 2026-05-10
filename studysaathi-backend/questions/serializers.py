from rest_framework import serializers
from .models import Question, Answer, Vote, Bookmark
from accounts.serializers import UserSerializer


class AnswerSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_faculty = serializers.SerializerMethodField()
    author_initial = serializers.SerializerMethodField()
    upvotes = serializers.ReadOnlyField()
    is_ai_generated = serializers.ReadOnlyField()

    class Meta:
        model = Answer
        fields = [
            'id',
            'question',
            'author',
            'author_name',
            'author_faculty',
            'author_initial',
            'content',
            'is_accepted',
            'is_ai_generated',
            'upvotes',
            'created_at',
            'updated_at',
        ]

    def get_author_name(self, obj):
        # AI answers always show AI name
        if obj.is_ai_generated:
            return 'StudySaathi AI'
        return obj.author.full_name

    def get_author_faculty(self, obj):
        if obj.is_ai_generated:
            return 'AI Assistant'
        return obj.author.faculty
    
    def get_author_initial(self, obj):
        if obj.is_ai_generated:
            return '✦'
        name = obj.author.full_name or ''
        return name[0].upper() if name else '?'

class QuestionListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    upvotes = serializers.ReadOnlyField()
    answers_count = serializers.ReadOnlyField()
    has_accepted_answer = serializers.ReadOnlyField()
    
    class Meta:
        model = Question
        fields = ['id', 'title', 'content', 'author', 'faculty', 'semester', 'subject', 'tags', 
                  'is_anonymous', 'upvotes', 'answers_count', 'has_accepted_answer', 'views', 'created_at']


class QuestionDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    answers = AnswerSerializer(many=True, read_only=True)
    upvotes = serializers.ReadOnlyField()
    answers_count = serializers.ReadOnlyField()
    has_accepted_answer = serializers.ReadOnlyField()
    
    class Meta:
        model = Question
        fields = ['id', 'title', 'content', 'author', 'faculty', 'semester', 'subject', 'tags', 
                  'is_anonymous', 'upvotes', 'answers_count', 'has_accepted_answer', 'views', 
                  'created_at', 'updated_at', 'answers']


class QuestionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['title', 'content', 'faculty', 'semester', 'subject', 'tags', 'is_anonymous']
    
    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['author'] = request.user
        return super().create(validated_data)


class AnswerCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['content']
    
    def create(self, validated_data):
        request = self.context.get('request')
        question_id = self.context.get('question_id')
        validated_data['author'] = request.user
        validated_data['question_id'] = question_id
        return super().create(validated_data)


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['vote_type']