// src/components/AIAnswerSection.jsx

import { useState } from 'react';
import { Sparkles, RefreshCw, AlertCircle, ChevronDown, ChevronUp, Bot } from 'lucide-react';
import api from '../services/api'; // adjust path to your axios instance

const AIAnswerSection = ({ questionId, existingAiAnswer = null }) => {
  const [aiAnswer, setAiAnswer] = useState(existingAiAnswer);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [modelUsed, setModelUsed] = useState(null);

  // ── Exact same formatContent as your QuestionDetailPage ──
  const formatContent = (content) => {
    if (!content) return null;
    return content.split('```').map((part, index) => {
      if (index % 2 === 1) {
        const lines = part.split('\n');
        const code = lines.slice(1).join('\n') || part;
        return (
          <pre
            key={index}
            className="bg-dark-900 border border-white/10 rounded-lg p-4 my-4 overflow-x-auto"
          >
            <code className="text-sm text-green-400 font-mono">{code}</code>
          </pre>
        );
      }
      return (
        <span key={index} className="whitespace-pre-wrap">
          {part.split('**').map((text, i) =>
            i % 2 === 1 ? (
              <strong key={i} className="text-white font-semibold">
                {text}
              </strong>
            ) : (
              text
            )
          )}
        </span>
      );
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/questions/${questionId}/ai-answer/`);
      setAiAnswer(res.data.answer);
      setModelUsed(res.data.model_used);
      setIsCollapsed(false);
    } catch (err) {
      if (err.response?.status === 503) {
        setError('AI service is temporarily unavailable. Please try again in a moment.');
      } else if (err.response?.status === 401) {
        setError('Please login to get AI answers.');
      } else {
        setError('Failed to generate AI answer. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    setError(null);
    try {
      const res = await api.post(`/questions/${questionId}/ai-answer/regenerate/`);
      setAiAnswer(res.data.answer);
      setModelUsed(res.data.model_used);
      setIsCollapsed(false);
    } catch (err) {
      setError('Failed to regenerate. Please try again.');
    } finally {
      setRegenerating(false);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // ── State: No AI answer yet ──────────────────────────
  if (!aiAnswer) {
    return (
      <div className="card border border-primary-500/20 bg-gradient-to-br from-primary-500/5 to-accent-purple/5 mb-6">
        <div className="flex items-start gap-4">
          {/* AI Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold">Get an AI Answer</h3>
              <span className="px-2 py-0.5 text-xs rounded-full bg-primary-500/20 text-primary-400 font-medium border border-primary-500/30">
                Beta
              </span>
            </div>
            <p className="text-dark-300 text-sm mb-4">
              No answers yet? Get an instant AI-powered response while waiting
              for the community.
            </p>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Generating Answer...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Get AI Answer
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="mt-4 pt-4 border-t border-white/5 space-y-2 animate-pulse">
            <div className="h-3 bg-white/10 rounded-full w-full" />
            <div className="h-3 bg-white/10 rounded-full w-5/6" />
            <div className="h-3 bg-white/10 rounded-full w-4/6" />
            <div className="h-3 bg-white/10 rounded-full w-full" />
            <div className="h-3 bg-white/10 rounded-full w-3/4" />
          </div>
        )}
      </div>
    );
  }

  // ── State: AI answer exists ──────────────────────────
  return (
    <div className="card border border-primary-500/30 bg-gradient-to-br from-primary-500/5 to-accent-purple/5 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* AI Avatar */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center flex-shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">
                StudySaathi AI
              </span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-primary-500/20 text-primary-400 font-medium border border-primary-500/30">
                AI Answer
              </span>
              {modelUsed && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-white/5 text-dark-400 border border-white/10">
                  {modelUsed}
                </span>
              )}
            </div>
            <span className="text-dark-400 text-xs">
              {timeAgo(aiAnswer.created_at)}
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* Regenerate button */}
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            title="Get a different explanation"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-dark-300 hover:text-white text-xs font-medium transition-all border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              size={13}
              className={regenerating ? 'animate-spin' : ''}
            />
            {regenerating ? 'Regenerating...' : 'Regenerate'}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-dark-400 hover:text-white text-xs transition-all border border-white/5"
          >
            {isCollapsed ? (
              <>
                <ChevronDown size={13} /> Show
              </>
            ) : (
              <>
                <ChevronUp size={13} /> Hide
              </>
            )}
          </button>
        </div>
      </div>

      {/* Answer Content */}
      {!isCollapsed && (
        <>
          {regenerating ? (
            /* Regenerating skeleton */
            <div className="space-y-2 animate-pulse py-2">
              <div className="h-3 bg-white/10 rounded-full w-full" />
              <div className="h-3 bg-white/10 rounded-full w-5/6" />
              <div className="h-3 bg-white/10 rounded-full w-4/6" />
              <div className="h-3 bg-white/10 rounded-full w-full" />
              <div className="h-3 bg-white/10 rounded-full w-3/4" />
            </div>
          ) : (
            <div className="text-dark-200 leading-relaxed text-sm">
              {formatContent(aiAnswer.content)}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mt-4">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Footer disclaimer */}
          <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-white/5 text-dark-500 text-xs">
            <Bot size={12} />
            <span>
              AI-generated answer · Please verify important information ·
              Powered by Groq + Gemini
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAnswerSection;