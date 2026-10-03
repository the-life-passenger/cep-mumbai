import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  Trash2,
  Star,
  Clock,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminFeedbackPage() {
  const toast = useToast();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  async function loadFeedback() {
    setLoading(true);
    try {
      const data = await api.getAllFeedback();
      setFeedbackList(data);
    } catch (err) {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }

  const handleToggleApprove = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.updateFeedbackStatus(id, newStatus);
      setFeedbackList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, approved: newStatus } : item))
      );
      toast.success(newStatus ? 'Feedback approved and published' : 'Feedback unapproved/hidden');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback submission permanently?')) return;

    try {
      await api.deleteFeedback(id);
      toast.success('Feedback deleted');
      setFeedbackList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      toast.error('Failed to delete feedback');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Feedback Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Approve genuine community reviews to appear publicly on the /feedback page or reject spam.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {feedbackList.filter((f) => f.approved).length} Approved
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            {feedbackList.filter((f) => !f.approved).length} Pending
          </span>
        </div>
      </div>

      {/* Feedback List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            Loading feedback...
          </div>
        ) : feedbackList.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            No feedback submissions available yet.
          </div>
        ) : (
          feedbackList.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition ${
                item.approved
                  ? 'border-slate-200/80'
                  : 'border-amber-300 bg-amber-50/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          item.rating >= s
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1">
                      {item.rating}/5
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.approved
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.approved ? 'Publicly Visible' : 'Pending Moderation'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic mb-3">
                  "{item.feedback}"
                </p>

                {item.suggestion && (
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-3">
                    <strong className="text-slate-800">Suggestion:</strong> {item.suggestion}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-xs block">
                    {item.name || 'Anonymous Resident'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleApprove(item.id, item.approved)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                      item.approved
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {item.approved ? (
                      <>
                        <X className="w-3.5 h-3.5" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete feedback"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
