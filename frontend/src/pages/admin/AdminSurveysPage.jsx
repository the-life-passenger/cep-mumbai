import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  Trash2,
  Eye,
  Filter,
  MapPin,
  Calendar,
  User,
  HeartHandshake
} from 'lucide-react';
import { api } from '../../services/api';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export default function AdminSurveysPage() {
  const toast = useToast();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedResponse, setSelectedResponse] = useState(null);

  useEffect(() => {
    loadSurveys();
  }, []);

  async function loadSurveys() {
    setLoading(true);
    try {
      const data = await api.getSurveys();
      setSurveys(data);
    } catch (err) {
      toast.error('Failed to load survey responses');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this survey record?')) return;

    try {
      await api.deleteSurvey(id);
      toast.success('Survey response deleted');
      setSurveys((prev) => prev.filter((s) => s.id !== id));
      if (selectedResponse && selectedResponse.id === id) {
        setSelectedResponse(null);
      }
    } catch (err) {
      toast.error('Failed to delete response');
    }
  };

  const filtered = surveys.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.locality && s.locality.toLowerCase().includes(q)) ||
      (s.serviceAccessProblem && s.serviceAccessProblem.toLowerCase().includes(q)) ||
      (s.suggestions && s.suggestions.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Community Survey Submissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review ground survey data gathered from local residents across surveyed wards.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Total Responses: {surveys.length}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-subtle flex items-center justify-between">
        <div className="relative flex items-center rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 focus-within:ring-2 focus-within:ring-teal-500 w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search by locality, resident name, or issue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Survey Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Resident</th>
                <th className="py-3.5 px-4">Locality</th>
                <th className="py-3.5 px-4">Difficult Service</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-slate-400">
                    Loading survey records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-slate-400">
                    No survey responses found.
                  </td>
                </tr>
              ) : (
                filtered.map((surv) => (
                  <tr key={surv.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{surv.name || 'Anonymous'}</div>
                      <div className="text-[11px] text-slate-400">{surv.ageGroup}</div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {surv.locality}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {surv.serviceAccessProblem}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-400">
                      {new Date(surv.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => setSelectedResponse(surv)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleDelete(surv.id)}
                        className="p-1 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Response"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Response Details Modal */}
      {selectedResponse && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedResponse(null)}
          title={`Survey Response: ${selectedResponse.name || 'Anonymous'}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Resident:</span>
                <span className="font-bold text-slate-900">{selectedResponse.name || 'Anonymous'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Age Group:</span>
                <span className="font-bold text-slate-900">{selectedResponse.ageGroup}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Locality:</span>
                <span className="font-bold text-slate-900">{selectedResponse.locality}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Date:</span>
                <span className="font-mono text-slate-700">{new Date(selectedResponse.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 block mb-1">Difficult Service to Access:</span>
              <p className="p-2.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 font-medium">
                {selectedResponse.serviceAccessProblem}
              </p>
            </div>

            {selectedResponse.servicesAvailableNearby && (
              <div>
                <span className="font-bold text-slate-800 block mb-1">Services Available Nearby:</span>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {selectedResponse.servicesAvailableNearby}
                </p>
              </div>
            )}

            {selectedResponse.problemsFindingInfo && (
              <div>
                <span className="font-bold text-slate-800 block mb-1">Information Barriers:</span>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {selectedResponse.problemsFindingInfo}
                </p>
              </div>
            )}

            {selectedResponse.accessibilityProblem && (
              <div>
                <span className="font-bold text-slate-800 block mb-1">Accessibility Issues:</span>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {selectedResponse.accessibilityProblem}
                </p>
              </div>
            )}

            {selectedResponse.suggestions && (
              <div>
                <span className="font-bold text-slate-800 block mb-1">Resident Suggestions:</span>
                <p className="text-teal-900 bg-teal-50 p-2.5 rounded-xl border border-teal-200 font-medium">
                  {selectedResponse.suggestions}
                </p>
              </div>
            )}

            {selectedResponse.comments && (
              <div>
                <span className="font-bold text-slate-800 block mb-1">Additional Comments:</span>
                <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "{selectedResponse.comments}"
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedResponse(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
