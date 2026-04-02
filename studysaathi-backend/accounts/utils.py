from django.core.mail import send_mail
from django.conf import settings
from .models import OTP


def send_otp_email(email, otp):
    """Send OTP via email"""
    subject = 'StudySaathi - Email Verification'
    message = f'''
    Hello!
    
    Your OTP for email verification is: {otp}
    
    This OTP is valid for {settings.OTP_EXPIRY_MINUTES} minutes.
    
    If you didn't request this, please ignore this email.
    
    Best regards,
    StudySaathi Team
    '''
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False


def create_and_send_otp(email):
    """Generate OTP and send via email"""
    # Delete old OTPs for this email
    OTP.objects.filter(email=email, is_used=False).delete()
    
    # Generate new OTP
    otp_code = OTP.generate_otp()
    OTP.objects.create(email=email, otp=otp_code)
    
    # Send email
    send_otp_email(email, otp_code)
    
    return otp_code