# questions/ai_service.py

import logging
from django.conf import settings

logger = logging.getLogger(__name__)


class StudySaathiAI:

    def __init__(self):
        self._groq_client = None
        self._gemini_client = None

    @property
    def groq_client(self):
        if self._groq_client is None and settings.GROQ_API_KEY:
            try:
                from groq import Groq
                self._groq_client = Groq(api_key=settings.GROQ_API_KEY)
            except ImportError:
                logger.error("groq not installed. Run: pip install groq")
        return self._groq_client

    @property
    def gemini_client(self):
        if self._gemini_client is None and settings.GEMINI_API_KEY:
            try:
                from google import genai
                self._gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
            except ImportError:
                logger.error("google-genai not installed. Run: pip install google-genai")
        return self._gemini_client

    def _build_prompt(self, title, content, faculty, semester, subject, tags):
        faculty_map = {
            'CSIT': 'Computer Science & IT (TU)',
            'BCA': 'Bachelor of Computer Applications',
            'BIM': 'Bachelor of Information Management',
            'BBS': 'Bachelor of Business Studies',
            'BBM': 'Bachelor of Business Management',
            'Engineering': 'Engineering',
            'Science': 'Science',
            'Management': 'Management',
        }

        context_lines = []
        if faculty:
            context_lines.append(f"Program: {faculty_map.get(faculty, faculty)}")
        if semester:
            context_lines.append(f"Semester: {semester}")
        if subject:
            context_lines.append(f"Subject: {subject}")
        if tags and len(tags) > 0:
            context_lines.append(f"Topics: {', '.join(tags)}")

        context_block = "\n".join(context_lines) if context_lines else "General academic question"

        prompt = f"""You are StudySaathi AI, a knowledgeable academic assistant for college students in Nepal.
You help students understand concepts clearly and solve academic problems effectively.

Student Context:
{context_block}

Question Title: {title}

Question:
{content}

Instructions:
- Be clear, accurate, and educational
- Use simple language suitable for college students
- For concept questions: explain step by step with examples
- For math/numerical problems: show complete solution steps
- For programming questions: provide clean working code with explanations
- Use **bold** for important terms
- For code use triple backticks with language name
- End with a brief key takeaway

Answer:"""

        return prompt

    def _call_groq(self, prompt):
        if not self.groq_client:
            raise ValueError("Groq client not available - check GROQ_API_KEY")

        model_name = getattr(settings, 'GROQ_MODEL', 'llama-3.3-70b-versatile')

        response = self.groq_client.chat.completions.create(
            model=model_name,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are StudySaathi AI, an expert academic assistant "
                        "for college students in Nepal. Be helpful, clear, and educational."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=1024,
        )

        text = response.choices[0].message.content
        return text, f"Groq • {model_name}"

    def _call_gemini(self, prompt):
        if not self.gemini_client:
            raise ValueError("Gemini client not available - check GEMINI_API_KEY")

        from google import genai

        model_name = getattr(settings, 'GEMINI_MODEL', 'gemini-2.0-flash')

        response = self.gemini_client.models.generate_content(
            model=model_name,
            contents=prompt,
        )

        return response.text, f"Gemini • {model_name}"

    def generate_answer(self, title, content, faculty="", semester="", subject="", tags=None):
        if tags is None:
            tags = []

        if not title and not content:
            return None, None, False

        prompt = self._build_prompt(title, content, faculty, semester, subject, tags)

        # Try Groq first
        try:
            answer, model = self._call_groq(prompt)
            logger.info(f"✅ Groq answered: '{title[:50]}'")
            return answer, model, True
        except Exception as groq_err:
            logger.warning(f"⚠️ Groq failed: {groq_err} — trying Gemini...")

        # Fallback to Gemini
        try:
            answer, model = self._call_gemini(prompt)
            logger.info(f"✅ Gemini answered: '{title[:50]}'")
            return answer, model, True
        except Exception as gemini_err:
            logger.error(f"❌ Both AI services failed. Gemini error: {gemini_err}")
            return None, None, False