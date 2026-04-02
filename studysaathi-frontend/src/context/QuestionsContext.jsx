import { createContext, useState, useContext } from 'react';
import api from '../services/api';

const QuestionsContext = createContext();

export const QuestionsProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all questions from API
  const fetchQuestions = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filters.faculty) params.append('faculty', filters.faculty);
      if (filters.semester) params.append('semester', filters.semester);
      if (filters.sort) params.append('sort', filters.sort);

      const response = await api.get(`/questions/?${params}`);
      const data = response.data.results || response.data;
      setQuestions(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setQuestions([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create new question
  const addQuestion = async (questionData) => {
    try {
      const response = await api.post('/questions/', questionData);
      setQuestions(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Failed to create question:', error);
      throw error;
    }
  };

  // Get single question by ID
  const getQuestionById = async (id) => {
    try {
      const response = await api.get(`/questions/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch question:', error);
      return null;
    }
  };

  // Vote on question
  const voteQuestion = async (id, voteType = 'upvote') => {
    try {
      const response = await api.post(`/questions/${id}/vote/`, { vote_type: voteType });
      return response.data;
    } catch (error) {
      console.error('Failed to vote:', error);
      throw error;
    }
  };

  // Create answer
  const createAnswer = async (questionId, content) => {
    try {
      const response = await api.post(`/questions/${questionId}/answers/`, { content });
      return response.data;
    } catch (error) {
      console.error('Failed to create answer:', error);
      throw error;
    }
  };

  // Vote on answer
  const voteAnswer = async (answerId, voteType = 'upvote') => {
    try {
      const response = await api.post(`/answers/${answerId}/vote/`, { vote_type: voteType });
      return response.data;
    } catch (error) {
      console.error('Failed to vote:', error);
      throw error;
    }
  };

  // Accept answer
  const acceptAnswer = async (answerId) => {
    try {
      const response = await api.post(`/answers/${answerId}/accept/`);
      return response.data;
    } catch (error) {
      console.error('Failed to accept answer:', error);
      throw error;
    }
  };

  // Bookmark question
  const bookmarkQuestion = async (questionId) => {
    try {
      const response = await api.post(`/questions/${questionId}/bookmark/`);
      return response.data;
    } catch (error) {
      console.error('Failed to bookmark:', error);
      throw error;
    }
  };

  return (
    <QuestionsContext.Provider value={{
      questions,
      loading,
      searchQuery,
      setSearchQuery,
      fetchQuestions,
      addQuestion,
      getQuestionById,
      voteQuestion,
      createAnswer,
      voteAnswer,
      acceptAnswer,
      bookmarkQuestion,
    }}>
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error('useQuestions must be used within QuestionsProvider');
  }
  return context;
};