from rest_framework import serializers
from .models import Question, Answer, Vote, Bookmark
from accounts.serializers import UserSerializer


class AnswerSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    upvotes = serializers.ReadOnlyField()
    
    class Meta:
        model = Answer
        fields = ['id', 'question', 'author', 'content', 'is_accepted', 'is_ai_generated', 'upvotes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at', 'is_ai_generated']


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