from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone
from datetime import timedelta
import random
import string

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


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None  # Remove username field
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    faculty = models.CharField(max_length=50, choices=FACULTY_CHOICES)
    semester = models.CharField(max_length=1, choices=SEMESTER_CHOICES)
    bio = models.TextField(blank=True, null=True)
    reputation = models.IntegerField(default=0)
    is_verified = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    
    objects = UserManager()
    
    def __str__(self):
        return self.email
    
    class Meta:
        db_table = 'users'



class OTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    
    def is_valid(self):
        """Check if OTP is still valid (within 10 minutes)"""
        expiry_time = self.created_at + timedelta(minutes=10)
        is_expired = timezone.now() > expiry_time
        
        # Debug logging
        print(f"\n{'='*50}")
        print(f"🔍 OTP Validation Check:")
        print(f"Email: {self.email}")
        print(f"OTP: {self.otp}")
        print(f"Created: {self.created_at}")
        print(f"Expiry: {expiry_time}")
        print(f"Current Time: {timezone.now()}")
        print(f"Is Expired: {is_expired}")
        print(f"Is Used: {self.is_used}")
        print(f"Valid: {not is_expired and not self.is_used}")
        print(f"{'='*50}\n")
        
        return not is_expired and not self.is_used
    
    @staticmethod
    def generate_otp():
        """Generate random 6-digit OTP"""
        return ''.join(random.choices(string.digits, k=6))
    
    def __str__(self):
        return f"{self.email} - {self.otp}"
    
    class Meta:
        db_table = 'otps'
        ordering = ['-created_at']