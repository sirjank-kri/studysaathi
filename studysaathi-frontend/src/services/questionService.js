import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const questionService = {
  getQuestions: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`${API_ENDPOINTS.QUESTIONS.LIST}?${params}`);
    return response.data;
  },

  getQuestionDetail: async (id) => {
    const response = await api.get(API_ENDPOINTS.QUESTIONS.DETAIL(id));
    return response.data;
  },

  createQuestion: async (questionData) => {
    const response = await api.post(API_ENDPOINTS.QUESTIONS.CREATE, questionData);
    return response.data;
  },

  upvoteQuestion: async (id) => {
    const response = await api.post(API_ENDPOINTS.QUESTIONS.UPVOTE(id));
    return response.data;
  },

  createAnswer: async (questionId, answerData) => {
    const response = await api.post(API_ENDPOINTS.ANSWERS.CREATE(questionId), answerData);
    return response.data;
  },

  upvoteAnswer: async (id) => {
    const response = await api.post(API_ENDPOINTS.ANSWERS.UPVOTE(id));
    return response.data;
  },
};