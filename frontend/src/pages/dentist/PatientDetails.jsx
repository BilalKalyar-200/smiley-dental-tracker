// Patient Details page — dentist view
// What it needs from backend:
//   GET  /api/dentist/patient/:id  → full patient profile, symptoms, images, notes
//   POST /api/dentist/diagnosis    → add a diagnosis note for this patient
//   PUT  /api/appointments/:id/status → confirm or complete appointments

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const PatientDetails = () => {
  const { id } = useParams(); // Patient ID from URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('symptoms'); // symptoms | images | notes | appointments

  // Diagnosis form
  const [diagForm, setDiagForm] = useState({
    diagnosis: '', treatment: '', medications: '', followUpDate: '',
  });
  const [diagSubmitting, setDiagSubmitting] = useState(false);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const res = await api.get(`/dentist/patient/${id}`);
      setData(res.data);
    } catch {
      toast.error('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const handleDiagnosisSubmit = async (e) => {
    e.preventDefault();
    if (!diagForm.diagnosis) return toast.error('Diagnosis is required');
    setDiagSubmitting(true);
    try {
      const res = await api.post('/dentist/diagnosis', { patientId: id, ...diagForm });
      setData(prev => ({ ...prev, notes: [res.data.note, ...prev.notes] }));
      setDiagForm({ diagnosis: '', treatment: '', medications: '', followUpDate: '' });
      toast.success('Diagnosis note added!');
    } catch {
      toast.error('Failed to add diagnosis');
    } finally {
      setDiagSubmitting(false);
    }
  };

  const tabs = ['symptoms', 'images', 'notes', 'add diagnosis'];

  if (loading) return <Loader />;
  if (!data) return <div className="text-center text-gray-400 mt-20">Patient not found</div>;

  const { patient, symptoms, images, notes } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Patient Header */}
      <div className="card mb-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {patient.fullName?.[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{patient.fullName}</h1>
          <p className="text-gray-400">{patient.email} · {patient.phoneNumber || 'No phone'}</p>
          <p className="text-gray-500 text-sm mt-1">
            {patient.gender} ·{' '}
            {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'DOB not set'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? 'bg-blue-600 text-white' : 'bg-[#1e2a45] text-gray-400 hover:text-white'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Symptoms Tab */}
      {tab === 'symptoms' && (
        <div className="space-y-3">
          {symptoms.length === 0 ? (
            <div className="card text-center text-gray-400 py-10">No symptoms reported.</div>
          ) : symptoms.map(s => (
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
                  {s.description && <p className="text-gray-300 text-sm mt-1">{s.description}</p>}
                </div>
                <span className={`text-sm font-semibold capitalize ${
                  s.severity === 'mild' ? 'text-green-400' : s.severity === 'moderate' ? 'text-yellow-400' : 'text-red-400'
                }`}>{s.severity}</span>
              </div>
              <p className="text-gray-600 text-xs mt-2">{new Date(s.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Images Tab */}
      {tab === 'images' && (
        <div>
          {images.length === 0 ? (
            <div className="card text-center text-gray-400 py-10">No images uploaded.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map(img => (
                <div key={img._id} className="card p-0 overflow-hidden">
                  <img src={`http://localhost:5000${img.imageUrl}`} alt={img.viewType}
                    className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <p className="text-blue-400 text-sm capitalize">{img.viewType} view</p>
                    {img.notes && <p className="text-gray-400 text-xs mt-1">{img.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Diagnosis Notes Tab */}
      {tab === 'notes' && (
        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="card text-center text-gray-400 py-10">No diagnosis notes yet.</div>
          ) : notes.map(n => (
            <div key={n._id} className="card">
              <p className="text-white font-medium mb-2">Diagnosis by Dr. {n.dentist?.fullName}</p>
              <p className="text-gray-300 text-sm mb-2"><span className="text-gray-400">Diagnosis: </span>{n.diagnosis}</p>
              {n.treatment && <p className="text-gray-300 text-sm mb-1"><span className="text-gray-400">Treatment: </span>{n.treatment}</p>}
              {n.medications && <p className="text-gray-300 text-sm mb-1"><span className="text-gray-400">Medications: </span>{n.medications}</p>}
              {n.followUpDate && (
                <p className="text-blue-400 text-sm">Follow-up: {new Date(n.followUpDate).toDateString()}</p>
              )}
              <p className="text-gray-600 text-xs mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Diagnosis Tab */}
      {tab === 'add diagnosis' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-5">Add Diagnosis Note</h2>
          <form onSubmit={handleDiagnosisSubmit} className="space-y-4">
            <div>
              <label className="form-label">Diagnosis *</label>
              <textarea value={diagForm.diagnosis}
                onChange={e => setDiagForm({ ...diagForm, diagnosis: e.target.value })}
                placeholder="Describe the diagnosis..." rows={3}
                className="input-field resize-none" required />
            </div>
            <div>
              <label className="form-label">Recommended Treatment</label>
              <textarea value={diagForm.treatment}
                onChange={e => setDiagForm({ ...diagForm, treatment: e.target.value })}
                placeholder="Treatment plan..." rows={2}
                className="input-field resize-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Medications</label>
                <input value={diagForm.medications}
                  onChange={e => setDiagForm({ ...diagForm, medications: e.target.value })}
                  placeholder="e.g. Ibuprofen 400mg" className="input-field" />
              </div>
              <div>
                <label className="form-label">Follow-up Date</label>
                <input type="date" value={diagForm.followUpDate}
                  onChange={e => setDiagForm({ ...diagForm, followUpDate: e.target.value })}
                  className="input-field" />
              </div>
            </div>
            <button type="submit" disabled={diagSubmitting} className="btn-primary">
              {diagSubmitting ? 'Saving...' : '💾 Save Diagnosis Note'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;