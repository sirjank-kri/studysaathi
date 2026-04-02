from django.contrib import admin
from .models import Question, Answer, Vote, Bookmark


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'faculty', 'semester', 'views', 'created_at']
    list_filter = ['faculty', 'semester', 'created_at', 'is_anonymous']
    search_fields = ['title', 'content', 'author__email']
    readonly_fields = ['views', 'created_at', 'updated_at']


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['question', 'author', 'is_accepted', 'is_ai_generated', 'created_at']
    list_filter = ['is_accepted', 'is_ai_generated', 'created_at']
    search_fields = ['content', 'author__email']


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ['user', 'vote_type', 'question', 'answer', 'created_at']
    list_filter = ['vote_type', 'created_at']


@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ['user', 'question', 'created_at']
    list_filter = ['created_at']