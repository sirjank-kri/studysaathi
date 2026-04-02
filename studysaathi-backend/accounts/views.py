from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
from django.contrib.auth import authenticate, get_user_model
from .serializers import (
    UserSignupSerializer, 
    VerifyOTPSerializer, 
    LoginSerializer, 
    UserSerializer,
    UserUpdateSerializer
)
from .models import OTP
from .utils import create_and_send_otp

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """Step 1: Collect user data and send OTP"""
    serializer = UserSignupSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        
        # Store in cache instead of session (expires in 10 minutes)
        cache.set(f'signup_{email}', serializer.validated_data, timeout=600)
        
        # Generate and send OTP
        otp = create_and_send_otp(email)
        
        print(f"\n{'='*50}")
        print(f"📧 Email: {email}")
        print(f"🔑 OTP: {otp}")
        print(f"{'='*50}\n")
        
        return Response({
            'message': 'OTP sent to your email',
            'email': email,
            'otp': otp  # For development
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """Step 2: Verify OTP and create user"""
    print("\n" + "="*50)
    print("🔐 VERIFY OTP REQUEST")
    print("Request Data:", request.data)
    
    serializer = VerifyOTPSerializer(data=request.data)
    if not serializer.is_valid():
        print("❌ Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    otp_code = serializer.validated_data['otp']
    
    print(f"Email: {email}")
    print(f"OTP Code: {otp_code}")
    
    # Check all OTPs for this email (for debugging)
    all_otps = OTP.objects.filter(email=email)
    print(f"\n📋 All OTPs for {email}:")
    for otp_obj in all_otps:
        print(f"  - OTP: {otp_obj.otp}, Used: {otp_obj.is_used}, Created: {otp_obj.created_at}")
    
    # Get latest OTP
    try:
        otp_obj = OTP.objects.filter(email=email, otp=otp_code, is_used=False).latest('created_at')
        print(f"✅ Found OTP: {otp_obj.otp}")
    except OTP.DoesNotExist:
        print(f"❌ No matching OTP found for email={email}, otp={otp_code}")
        
        # Check if OTP exists but is already used
        used_otp = OTP.objects.filter(email=email, otp=otp_code, is_used=True).first()
        if used_otp:
            return Response({'error': 'OTP already used. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if wrong OTP
        latest = OTP.objects.filter(email=email, is_used=False).first()
        if latest:
            print(f"💡 Latest unused OTP is: {latest.otp}")
        
        return Response({'error': 'Invalid OTP. Please check and try again.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if OTP is valid (not expired)
    if not otp_obj.is_valid():
        print("❌ OTP expired")
        return Response({'error': 'OTP expired. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)
    
    print("✅ OTP is valid!")
    
    # Mark OTP as used
    otp_obj.is_used = True
    otp_obj.save()
    print("✅ OTP marked as used")
    
    # Get signup data from cache
    signup_data = cache.get(f'signup_{email}')
    if not signup_data:
        print(f"❌ No signup data in cache for {email}")
        return Response({'error': 'Session expired. Please signup again.'}, status=status.HTTP_400_BAD_REQUEST)
    
    print(f"✅ Found signup data: {signup_data}")
    
    # Create user
    try:
        user = User.objects.create_user(**signup_data)
        user.is_verified = True
        user.save()
        print(f"✅ User created: {user.email}")
    except Exception as e:
        print(f"❌ User creation error: {e}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    # Clear cache
    cache.delete(f'signup_{email}')
    
    # Generate tokens
    refresh = RefreshToken.for_user(user)
    
    print("✅ Tokens generated")
    print("="*50 + "\n")
    
    return Response({
        'message': 'Account created successfully',
        'user': UserSerializer(user).data,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def resend_otp(request):
    """Resend OTP"""
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    otp = create_and_send_otp(email)
    
    return Response({
        'message': 'OTP sent successfully',
        'otp': otp  # Remove in production
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login user with email and password"""
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    
    # Authenticate
    user = authenticate(request, username=email, password=password)
    
    if user is None:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if not user.is_verified:
        return Response({'error': 'Email not verified'}, status=status.HTTP_403_FORBIDDEN)
    
    # Generate tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'message': 'Login successful',
        'user': UserSerializer(user).data,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    """Get or update user profile"""
    user = request.user
    
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def logout(request):
    """Logout (client should delete tokens)"""
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
