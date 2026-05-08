//needs: GET /api/patient/diagnosis -> fetch all diagnosis notes for logged-in patient

import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const MyDiagnosis = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/patient/diagnosis");
        setNotes(res.data.notes || []);
      } catch {
        toast.error("Failed to load diagnosis notes");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">My Diagnoses</h1>
      <p className="text-gray-400 mb-8">
        Notes and treatment plans from your dentist
      </p>

      {notes.length === 0 ? (
        <div className="card text-center text-gray-400 py-16">
          <p className="text-4xl mb-3">🩺</p>
          <p>No diagnosis notes yet. Visit your dentist to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((n) => (
            <div key={n._id} className="card border-l-4 border-blue-500">
              {/* Dentist & Date */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-blue-400 font-semibold">
                    Dr. {n.dentist?.fullName}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {n.dentist?.specialization}
                  </p>
                </div>
                <p className="text-gray-500 text-xs">
                  {new Date(n.createdAt).toDateString()}
                </p>
              </div>

              {/* Diagnosis */}
              <div className="mb-3">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                  Diagnosis
                </p>
                <p className="text-white">{n.diagnosis}</p>
              </div>

              {/* Treatment */}
              {n.treatment && (
                <div className="mb-3">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                    Treatment Plan
                  </p>
                  <p className="text-gray-300">{n.treatment}</p>
                </div>
              )}

              {/* Medications */}
              {n.medications && (
                <div className="mb-3">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                    Medications
                  </p>
                  <p className="text-gray-300">💊 {n.medications}</p>
                </div>
              )}

              {/* Follow-up */}
              {n.followUpDate && (
                <div className="mt-3 bg-blue-900/30 border border-blue-700 rounded-lg px-4 py-2">
                  <p className="text-blue-300 text-sm">
                    📅 Follow-up:{" "}
                    <span className="font-semibold">
                      {new Date(n.followUpDate).toDateString()}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDiagnosis;
