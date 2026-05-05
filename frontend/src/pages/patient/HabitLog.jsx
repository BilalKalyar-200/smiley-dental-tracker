// Habit Tracker page
// What it needs from backend:
//   GET  /api/habits        -> get all habit logs for this patient
//   POST /api/habits        -> save today's habit log
//   GET  /api/habits/score  -> get health score based on recent habits

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const HabitLog = () => {
  const [logs, setLogs] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [todayLogged, setTodayLogged] = useState(false);

  const [form, setForm] = useState({
    brushedMorning: false,
    brushedNight: false,
    flossed: false,
    mouthwashUsed: false,
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [logsRes, scoreRes] = await Promise.all([
        api.get('/habits'),
        api.get('/habits/score'),
      ]);
      const allLogs = logsRes.data.logs || [];
      setLogs(allLogs);
      setScore(scoreRes.data.score);

      // Check if today already logged
      const today = new Date().toDateString();
      const alreadyLogged = allLogs.some(l => new Date(l.date).toDateString() === today);
      setTodayLogged(alreadyLogged);
    } catch {
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const toggle = (field) => setForm(prev => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/habits', { ...form, date: new Date() });
      setLogs([res.data.log, ...logs]);
      setTodayLogged(true);
      // Refresh score
      const scoreRes = await api.get('/habits/score');
      setScore(scoreRes.data.score);
      toast.success('Habits logged for today!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log habits');
    } finally {
      setSubmitting(false);
    }
  };

  const CheckItem = ({ field, label, icon }) => (
    <button type="button" onClick={() => toggle(field)}
      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
        form[field]
          ? 'bg-blue-600/20 border-blue-500 text-white'
          : 'bg-[#1a2235] border-[#2d3f6b] text-gray-400 hover:border-blue-500'
      }`}>
      <span className="text-2xl">{icon}</span>
      <span className="font-medium">{label}</span>
      <span className={`ml-auto text-xl ${form[field] ? 'text-green-400' : 'text-gray-600'}`}>
        {form[field] ? '✅' : '⬜'}
      </span>
    </button>
  );

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Habit Tracker</h1>
      <p className="text-gray-400 mb-8">Log your daily oral hygiene habits</p>

      {/* Health Score */}
      {score !== null && (
        <div className="card mb-8 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Your Health Score</p>
            <p className="text-gray-300 text-xs mt-1">Based on last 7 days of habits</p>
          </div>
          <div className="text-right">
            <p className={`text-5xl font-bold ${
              score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400'
            }`}>{score}%</p>
          </div>
        </div>
      )}

      {/* Today's Log Form */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">
          {todayLogged ? "✅ Today's habits already logged!" : "Log Today's Habits"}
        </h2>

        {todayLogged ? (
          <p className="text-gray-400">Come back tomorrow to log your next day's habits.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CheckItem field="brushedMorning" label="Brushed Morning" icon="🌅" />
              <CheckItem field="brushedNight" label="Brushed Night" icon="🌙" />
              <CheckItem field="flossed" label="Flossed" icon="🧵" />
              <CheckItem field="mouthwashUsed" label="Used Mouthwash" icon="💧" />
            </div>
            <div>
              <label className="form-label">Notes (optional)</label>
              <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="Anything to note about today..." className="input-field" />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Saving...' : '💾 Save Today\'s Log'}
            </button>
          </form>
        )}
      </div>

      {/* Log History */}
      <h2 className="text-xl font-semibold text-white mb-4">Recent Habit Logs</h2>
      {logs.length === 0 ? (
        <div className="card text-center text-gray-400 py-10">No habit logs yet.</div>
      ) : (
        <div className="space-y-3">
          {logs.slice(0, 14).map(log => {
            // Count how many habits were done
            const done = [log.brushedMorning, log.brushedNight, log.flossed, log.mouthwashUsed].filter(Boolean).length;
            return (
              <div key={log._id} className="card flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">{new Date(log.date).toDateString()}</p>
                  <div className="flex gap-3 mt-1 text-sm">
                    <span className={log.brushedMorning ? 'text-green-400' : 'text-gray-600'}>🌅 AM</span>
                    <span className={log.brushedNight ? 'text-green-400' : 'text-gray-600'}>🌙 PM</span>
                    <span className={log.flossed ? 'text-green-400' : 'text-gray-600'}>🧵 Floss</span>
                    <span className={log.mouthwashUsed ? 'text-green-400' : 'text-gray-600'}>💧 MW</span>
                  </div>
                </div>
                <span className={`text-lg font-bold ${done === 4 ? 'text-green-400' : done >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {done}/4
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HabitLog;