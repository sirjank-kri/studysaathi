export const FACULTIES = [
  { value: 'CSIT', label: 'Computer Science & IT' },
  { value: 'BCA', label: 'Bachelor of Computer Applications' },
  { value: 'BIM', label: 'Bachelor of Information Management' },
  { value: 'BBS', label: 'Bachelor of Business Studies' },
  { value: 'BBM', label: 'Bachelor of Business Management' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Science', label: 'Science' },
  { value: 'Management', label: 'Management' },
];

export const SEMESTERS = [
  { value: '1', label: 'First Semester' },
  { value: '2', label: 'Second Semester' },
  { value: '3', label: 'Third Semester' },
  { value: '4', label: 'Fourth Semester' },
  { value: '5', label: 'Fifth Semester' },
  { value: '6', label: 'Sixth Semester' },
  { value: '7', label: 'Seventh Semester' },
  { value: '8', label: 'Eighth Semester' },
];

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup/',
    LOGIN: '/auth/login/',
    VERIFY_OTP: '/auth/verify-otp/',
    RESEND_OTP: '/auth/resend-otp/',
    LOGOUT: '/auth/logout/',
    PROFILE: '/auth/profile/',
  },
  QUESTIONS: {
    LIST: '/questions/',
    CREATE: '/questions/create/',
    DETAIL: (id) => `/questions/${id}/`,
    UPVOTE: (id) => `/questions/${id}/upvote/`,
  },
  ANSWERS: {
    CREATE: (questionId) => `/questions/${questionId}/answers/`,
    UPVOTE: (id) => `/answers/${id}/upvote/`,
  },
};