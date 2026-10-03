import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  Send,
  CheckCircle2,
  ShieldCheck,
  User,
  Quote,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function FeedbackPage() {
  const toast = useToast();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    async function loadFeedback() {
      try {
        const data = await api.getPublicFeedback();
        setFeedbackList(data);
      } catch (err) {
        console.error('Failed to load feedback:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast.error('Please share your thoughts in the feedback field');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitFeedback({
        name: name.trim() || 'Community Member',
        rating,
        feedback: feedback.trim(),
        suggestion: suggestion.trim()
      });
      setSubmittedSuccess(true);
      toast.success('Feedback submitted! It will appear once approved by the project team.');
      setName('');
      setFeedback('');
      setSuggestion('');
      setRating(5);
    } catch (err) {
      toast.error(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* 1. Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider border border-teal-200/60">
          <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
          Community Feedback
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          Community Voice & Reviews
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Read verified feedback from neighborhood residents and share your experience to help improve local service mapping.
        </p>
      </div>

      {/* 2. Feedback Form & Submission Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h2 className="text-lg font-bold text-slate-900">Leave Your Feedback</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            All reviews are moderated by our CEP student team to maintain civic data integrity.
          </p>
        </div>

        {submittedSuccess ? (
          <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-emerald-950">Thank you for your feedback!</h3>
            <p className="text-xs text-emerald-800 max-w-sm mx-auto">
              Your review has been safely stored and will be published upon routine moderation.
            </p>
            <button
              onClick={() => setSubmittedSuccess(false)}
              className="text-xs font-bold text-emerald-900 underline underline-offset-2 pt-2"
            >
              Submit another review
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star Rating Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Overall Experience Rating <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-300 hover:scale-110 transition-transform focus:outline-none"
                    aria-label={`${star} star rating`}
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-500 ml-2">
                  {rating === 5 && 'Outstanding'}
                  {rating === 4 && 'Very Helpful'}
                  {rating === 3 && 'Good / Average'}
                  {rating === 2 && 'Needs Improvement'}
                  {rating === 1 && 'Difficult to Use'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Priya Sharma or leave blank"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Feedback <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="How has this civic directory helped you? What was your experience finding local services?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Suggestions for Improvement <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Any additional facilities or features we should add?"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow transition active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-teal-400" />
              <span>{submitting ? 'Submitting...' : 'Post Feedback'}</span>
            </button>
          </form>
        )}
      </div>

      {/* 3. Approved Community Reviews Display */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              Approved Community Reviews
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified testimonials from local residents, healthcare workers, and students.
            </p>
          </div>
          <div className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
            {feedbackList.length} Published
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-slate-100 rounded-2xl animate-pulse"></div>
            <div className="h-40 bg-slate-100 rounded-2xl animate-pulse"></div>
            <div className="h-40 bg-slate-100 rounded-2xl animate-pulse"></div>
          </div>
        ) : feedbackList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No public reviews yet</p>
            <p className="text-xs text-slate-500 mt-1">Be the first to share your thoughts above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbackList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            item.rating >= s
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                    "{item.feedback}"
                  </p>

                  {item.suggestion && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-4">
                      <strong className="text-slate-800">Suggestion:</strong> {item.suggestion}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-teal-400 flex items-center justify-center text-xs font-bold">
                    {item.name ? item.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {item.name || 'Community Resident'}
                    </p>
                    <span className="text-[10px] text-teal-700 font-medium">Verified Resident</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
