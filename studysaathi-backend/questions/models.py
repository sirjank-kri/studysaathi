from django.db import models
from django.conf import settings

FACULTY_CHOICES = [
    ('CSIT', 'Computer Science & IT'),
    ('BCA', 'Bachelor of Computer Applications'),
    ('BIM', 'Bachelor of Information Management'),
    ('BBS', 'Bachelor of Business Studies'),
    ('BBM', 'Bachelor of Business Management'),
    ('Engineering', 'Engineering'),
    ('Science', 'Science'),
    ('Management', 'Management'),
]

SEMESTER_CHOICES = [(str(i), f'Semester {i}') for i in range(1, 9)]


class Question(models.Model):
    title = models.CharField(max_length=500)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='questions')
    faculty = models.CharField(max_length=50, choices=FACULTY_CHOICES)
    semester = models.CharField(max_length=1, choices=SEMESTER_CHOICES)
    subject = models.CharField(max_length=100, blank=True, null=True)
    tags = models.JSONField(default=list)  # Array of tags
    is_anonymous = models.BooleanField(default=False)
    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'questions'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def upvotes(self):
        return self.votes.filter(vote_type='upvote').count() - self.votes.filter(vote_type='downvote').count()
    
    @property
    def answers_count(self):
        return self.answers.count()
    
    @property
    def has_accepted_answer(self):
        return self.answers.filter(is_accepted=True).exists()


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='answers')
    content = models.TextField()
    is_accepted = models.BooleanField(default=False)
    is_ai_generated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'answers'
        ordering = ['-is_accepted', '-created_at']
    
    def __str__(self):
        return f"Answer by {self.author.full_name} on {self.question.title[:50]}"
    
    @property
    def upvotes(self):
        return self.votes.filter(vote_type='upvote').count() - self.votes.filter(vote_type='downvote').count()


class Vote(models.Model):
    VOTE_TYPES = [
        ('upvote', 'Upvote'),
        ('downvote', 'Downvote'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='votes', null=True, blank=True)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='votes', null=True, blank=True)
    vote_type = models.CharField(max_length=10, choices=VOTE_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'votes'
        unique_together = [
            ['user', 'question'],
            ['user', 'answer'],
        ]
    
    def __str__(self):
        target = self.question or self.answer
        return f"{self.user.email} {self.vote_type} on {target}"


class Bookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookmarks')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'bookmarks'
        unique_together = ['user', 'question']
    
    def __str__(self):
        return f"{self.user.email} bookmarked {self.question.title[:50]}"