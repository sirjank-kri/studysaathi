from django.urls import path
from . import views

urlpatterns = [
    # Questions
    path('questions/', views.question_list, name='question-list'),
    path('questions/<int:pk>/', views.question_detail, name='question-detail'),
    path('questions/<int:pk>/vote/', views.vote_question, name='vote-question'),
    path('questions/<int:pk>/bookmark/', views.bookmark_question, name='bookmark-question'),
    
    # Answers
    path('questions/<int:question_id>/answers/', views.create_answer, name='create-answer'),
    path('answers/<int:pk>/vote/', views.vote_answer, name='vote-answer'),
    path('answers/<int:pk>/accept/', views.accept_answer, name='accept-answer'),
    
    # User specific
    path('my-questions/', views.my_questions, name='my-questions'),
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
]