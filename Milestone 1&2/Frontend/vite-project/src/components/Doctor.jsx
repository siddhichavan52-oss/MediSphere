import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const Doctor = ({ doctorName = "Elena Rostova" }) => {
  const [activeTab, setActiveTab] = useState('schedule');
  const API_BASE = "http://localhost:8081/api/clinical";
  
  // Resolve doctor ID reliably from localStorage
  const doctorId = Number(localStorage.getItem('doctorId') || localStorage.getItem('userId'));

  const [appointments, setAppointments] = useState([]);
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [chartForm, setChartForm] = useState({ condition: '', prescription: '', billingCodes: '99213' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper utility to clean up potential duplicate "Dr." prefixes
  const formatDoctorName = (name) => {
    if (!name) return 'Unassigned';
    const cleanName = name.replace(/^Dr\.?\s*/i, '');
    return `Dr. ${cleanName}`;
  };

  const fetchDoctorTelemetry = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/appointments`);
      if (!res.ok) {
        throw new Error(`Unable to load appointments (HTTP ${res.status})`);
      }
      const allApps = await res.json();
      
      // Filter appointments assigned to this doctor (handles nested object or flat ID)
      const docApps = Array.isArray(allApps)
        ? allApps.filter(app => (app.doctor?.id || app.doctorId) === doctorId)
        : [];
      setAppointments(docApps);
    } catch (err) {
      console.error("Doctor synchronization pipeline dropped:", err);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchDoctorTelemetry();
    const interval = setInterval(fetchDoctorTelemetry, 4000); // Poll every 4s for instant check-in notifications
    return () => clearInterval(interval);
  }, [fetchDoctorTelemetry]);

  const startConsultation = (app) => {
    setActiveConsultation(app);
    setActiveTab('workspace');
  };

  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    if (!chartForm.condition || !chartForm.prescription) {
      alert("Please record diagnostic criteria and medicine guidelines before transmission.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/ehr/prescribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: activeConsultation.id,
          condition: chartForm.condition,
          prescription: chartForm.prescription,
          billingCodes: chartForm.billingCodes
        })
      });

      if (res.ok) {
        alert("Encounter documented. Prescription pushed to patient's dashboard; Billing codes transmitted to Admin.");
        setChartForm({ condition: '', prescription: '', billingCodes: '99213' });
        setActiveConsultation(null);
        setActiveTab('schedule');
        fetchDoctorTelemetry();
      }
    } catch (err) {
      console.error("Error writing EHR medical notes:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find if there is a patient ready & checked-in needing immediate attention
  const checkedInNotification = appointments.find(a => a.status === 'Checked In');
  const rawDoctorName = appointments[0]?.doctor?.name || doctorName;
  const loggedInDoctorName = formatDoctorName(rawDoctorName);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 font-sans antialiased relative flex overflow-hidden">
      {/* Background Graphic Patterns */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-30 pointer-events-none"></div>

      {/* Doctor Side Nav */}
      <aside className="w-68 bg-white/90 backdrop-blur-xl border-r border-slate-200 p-6 flex flex-col justify-between relative z-10 shrink-0 hidden md:flex">
        <div className="space-y-9">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/25">D</div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block">MediSphere</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 block mt-0.5">Practitioner Gateway</span>
            </div>
          </div>
          <nav className="space-y-1.5">
            <button onClick={() => setActiveTab('schedule')} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-bold text-xs uppercase transition-all ${activeTab === 'schedule' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-xs' : 'text-slate-500 hover:bg-slate-50'}`}>📅 Today's Schedule</button>
            <button onClick={() => activeConsultation ? setActiveTab('workspace') : alert("No active patient chart selected.")} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-bold text-xs uppercase transition-all ${activeTab === 'workspace' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-xs' : 'text-slate-500 hover:bg-slate-50'}`}>📝 Encounter Workspace</button>
          </nav>
        </div>
        <div className="pt-4 border-t border-slate-100">
          <Link to="/" onClick={() => { localStorage.removeItem("doctorId"); localStorage.removeItem("userId"); localStorage.removeItem("userRole"); }} className="flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-xs uppercase text-rose-600 hover:bg-rose-50">🚪 Log Off</Link>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10 max-w-7xl mx-auto w-full">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">{loggedInDoctorName}</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase">Practitioner Domain: <span className="text-emerald-600 font-bold">Authorized EHR Systems Access</span></p>
        </header>

        {/* Live Notification Banner */}
        {checkedInNotification && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between animate-bounce">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🔔</span>
              <div>
                <p className="text-xs font-black text-emerald-900 uppercase">Patient Arrival Alert</p>
                <p className="text-xs text-emerald-700 font-medium">{checkedInNotification.patient?.name || "The patient"} is ready and checked-in at <span className="font-bold">{checkedInNotification.roomNumber || "the designated triage station"}</span>.</p>
              </div>
            </div>
            <button onClick={() => startConsultation(checkedInNotification)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase font-black tracking-wider rounded-xl cursor-pointer">
              Open EHR Chart
            </button>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="text-lg font-black text-slate-800">Your Consultations Queue</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400">
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Scheduled Time Slot</th>
                    <th className="py-3 px-4">Encounter Reason</th>
                    <th className="py-3 px-4">Clinic Location</th>
                    <th className="py-3 px-4">Status Map</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-slate-400 font-medium">No appointments scheduled for your profile in the current database index.</td>
                    </tr>
                  ) : (
                    appointments.map((app) => (
                      <tr key={app.id}>
                        <td className="py-4 px-4 font-bold text-slate-800">{app.patient?.name || app.patientName || 'Unknown patient'}</td>
                        <td className="py-4 px-4 font-mono text-slate-500">{app.time}</td>
                        <td className="py-4 px-4 text-slate-500 font-medium">{app.reason}</td>
                        <td className="py-4 px-4 font-bold text-slate-600">{app.roomNumber || 'Awaiting Triage'}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase font-black ${
                            app.status === 'Waiting' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            app.status === 'Checked In' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {app.status === 'Checked In' ? (
                            <button onClick={() => startConsultation(app)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase font-black tracking-wider rounded-lg cursor-pointer">
                              Begin Visit
                            </button>
                          ) : app.status === 'Completed' ? (
                            <span className="text-slate-300 italic">Encounter Finalized</span>
                          ) : (
                            <span className="text-slate-400 italic">Awaiting Check-In</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'workspace' && activeConsultation && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs lg:col-span-2 space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-800">Active Consultation: {activeConsultation.patient?.name || activeConsultation.patientName || 'Unknown patient'}</h3>
                <p className="text-xs font-medium text-slate-400">Completing the forms below updates the patient's record vault and notifies the billing desk.</p>
              </div>

              <form onSubmit={handleConsultationSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Visit Diagnostic Findings & Notes</label>
                  <textarea 
                    rows="3" 
                    placeholder="Describe clinical evaluations and observations..." 
                    value={chartForm.condition} 
                    onChange={(e) => setChartForm({ ...chartForm, condition: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">EHR Prescriptions (Instructions Included)</label>
                  <input 
                    type="text" 
                    placeholder="Amoxicillin 500mg — Take 3 times daily for 7 days" 
                    value={chartForm.prescription} 
                    onChange={(e) => setChartForm({ ...chartForm, prescription: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Medical Billing / Insurance Procedure Codes (ICD-10 / CPT)</label>
                  <input 
                    type="text" 
                    placeholder="99213 - Evaluation & Management" 
                    value={chartForm.billingCodes} 
                    onChange={(e) => setChartForm({ ...chartForm, billingCodes: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer">
                  {isSubmitting ? "Syncing..." : "Publish Prescription & Send to Billing"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Doctor;