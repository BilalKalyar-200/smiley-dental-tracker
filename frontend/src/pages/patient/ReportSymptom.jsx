// Symptom Report page
// What it needs from backend:
//   POST /api/symptoms     → submit a new symptom report
//   GET  /api/symptoms     → fetch all previous symptom reports

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const SYMPTOM_TYPES = [
  { value: 'tooth_pain', label: '🦷 Tooth Pain' },
  { value: 'bleeding_gums', label: '🩸 Bleeding Gums' },
  { value: 'sensitivity', label: '🌡️ Sensitivity' },
  { value: 'staining', label: '☕ Staining' },
  { value: 'bad_breath', label: '💨 Bad Breath' },
  { value: 'swelling', label: '🫦 Swelling' },
  { value: 'other', label: '❓ Other' },
];

const ReportSymptom = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    symptomType: [],
    severity: 'mild',
    location: '',
    duration: '',
    description: '',
  });

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const res = await api.get('/symptoms');
      setSymptoms(res.data.symptoms || []);
    } catch {
      toast.error('Failed to load symptoms');
    } finally {
      setLoading(false);
    }
  };

  // Toggle symptom type selection (multi-select)
  const toggleSymptom = (value) => {
    setForm(prev => ({
      ...prev,
      symptomType: prev.symptomType.includes(value)
        ? prev.symptomType.filter(s => s !== value)
        : [...prev.symptomType, value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.symptomType.length === 0) return toast.error('Select at least one symptom');
    setSubmitting(true);
    try {
      const res = await api.post('/symptoms', form);
      setSymptoms([res.data.symptom, ...symptoms]);
      setForm({ symptomType: [], severity: 'mild', location: '', duration: '', description: '' });
      toast.success('Symptom reported!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const severityColor = (s) =>
    s === 'mild' ? 'text-green-400' : s === 'moderate' ? 'text-yellow-400' : 'text-red-400';

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Report a Symptom</h1>
      <p className="text-gray-400 mb-8">Log any dental discomfort so your dentist can review it</p>

      {/* Form */}
      <div className="card mb-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Symptom Type Multi-select */}
          <div>
            <label className="form-label">What are you experiencing? (select all that apply)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {SYMPTOM_TYPES.map(s => (
                <button key={s.value} type="button" onClick={() => toggleSymptom(s.value)}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all text-left ${
                    form.symptomType.includes(s.value)
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-[#1a2235] border-[#2d3f6b] text-gray-400 hover:border-blue-500'
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="form-label">Severity</label>
            <div className="flex gap-3">
              {['mild', 'moderate', 'severe'].map(s => (
                <button key={s} type="button" onClick={() => setForm({ ...form, severity: s })}
                  className={`flex-1 py-2 rounded-lg border capitalize font-medium text-sm transition-all ${
                    form.severity === s
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-[#1a2235] border-[#2d3f6b] text-gray-400 hover:border-blue-500'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Location (e.g. upper left molar)</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder="Where is the pain?" className="input-field" />
            </div>
            <div>
              <label className="form-label">Duration (e.g. 2 days)</label>
              <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
                placeholder="How long have you had this?" className="input-field" />
            </div>
          </div>

          <div>
            <label className="form-label">Description (optional)</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your symptom in detail..." rows={3}
              className="input-field resize-none" />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Submitting...' : '📝 Submit Report'}
          </button>
        </form>
      </div>

      {/* History */}
      <h2 className="text-xl font-semibold text-white mb-4">Symptom History</h2>
      {symptoms.length === 0 ? (
        <div className="card text-center text-gray-400 py-10">No symptoms reported yet.</div>
      ) : (
        <div className="space-y-3">
          {symptoms.map(s => (
            <div key={s._id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {s.symptomType.map(t => (
                      <span key={t} className="bg-[#1e2a45] text-blue-300 text-xs px-2 py-1 rounded-full capitalize">
                        {t.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                  {s.location && <p className="text-gray-400 text-sm">📍 {s.location}</p>}
                  {s.duration && <p className="text-gray-400 text-sm">⏱ {s.duration}</p>}
                  {s.description && <p className="text-gray-300 text-sm mt-1">{s.description}</p>}
                </div>
                <div className="text-right">
                  <p className={`font-semibold capitalize text-sm ${severityColor(s.severity)}`}>{s.severity}</p>
                  <p className="text-gray-600 text-xs mt-1">{new Date(s.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ReportSymptom;