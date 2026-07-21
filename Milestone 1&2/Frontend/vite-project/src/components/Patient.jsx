import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Patient = ({ patientId: defaultId = 1, patientName: defaultName = "Sarah Jenkins" }) => {
  const location = useLocation();

  // Dynamically resolve patient details from router state -> localStorage -> props
  const patientId = location.state?.patientId || localStorage.getItem("patientId") || defaultId;
  const patientName = location.state?.patientName || localStorage.getItem("patientName") || defaultName;

  const [activeTab, setActiveTab] = useState('book');
  const API_BASE = "http://localhost:8081/api/clinical";

  // Get today's date formatted for HTML date input (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  const [doctorsList, setDoctorsList] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [bookingForm, setBookingForm] = useState({ 
    doctorId: '', 
    reason: '', 
    date: todayStr, 
    time: '10:00 AM' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPatientTelemetry = useCallback(async () => {
    try {
      // 1. Fetch doctors
      const docRes = await fetch(`${API_BASE}/doctors`);
      const docData = await docRes.json();
      setDoctorsList(docData);

      // 2. Fetch appointments for this patient
      const appRes = await fetch(`${API_BASE}/patient/appointments/${patientId}`);
      const appData = await appRes.json();
      setMyAppointments(appData);
    } catch (err) {
      console.error("Connection drop on patient data sync:", err);
    }
  }, [API_BASE, patientId]);

  useEffect(() => {
    fetchPatientTelemetry();
    const interval = setInterval(fetchPatientTelemetry, 5000);
    return () => clearInterval(interval);
  }, [fetchPatientTelemetry]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.doctorId || !bookingForm.reason || !bookingForm.date) {
      alert("Please select a doctor, choose a date, and state your reason for the visit.");
      return;
    }

    const selectedDoctor = doctorsList.find(d => String(d.id) === String(bookingForm.doctorId));

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/appointments/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: parseInt(patientId),
          patientName: patientName,
          doctorId: parseInt(bookingForm.doctorId),
          doctorName: selectedDoctor ? selectedDoctor.name : '',
          reason: bookingForm.reason,
          date: bookingForm.date, // Sent to backend for Admin dashboard filtering
          time: bookingForm.time
        })
      });

      if (res.ok) {
        alert("Appointment requested successfully! It is now visible on the Admin's master schedule for the selected date.");
        setBookingForm({ doctorId: '', reason: '', date: todayStr, time: '10:00 AM' });
        setActiveTab('status');
        fetchPatientTelemetry();
      }
    } catch (err) {
      console.error("Booking write error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async (appointmentId) => {
    try {
      const res = await fetch(`${API_BASE}/appointments/${appointmentId}/pay`, {
        method: 'PUT'
      });
      if (res.ok) {
        alert("Payment authorized and processed successfully!");
        fetchPatientTelemetry();
      }
    } catch (err) {
      console.error("Payment integration error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 font-sans antialiased relative flex overflow-hidden">
      {/* Visual Ambient Backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-100/40 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-30 pointer-events-none"></div>

      {/* Sidebar Nav */}
      <aside className="w-68 bg-white/90 backdrop-blur-xl border-r border-slate-200 p-6 flex flex-col justify-between relative z-10 shrink-0 hidden md:flex">
        <div className="space-y-9">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 bg-gradient-to-tr from-cyan-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/25">M</div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block">MediSphere</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-600 block mt-0.5">Patient Hub</span>
            </div>
          </div>
          <nav className="space-y-1.5">
            <button onClick={() => setActiveTab('book')} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeTab === 'book' ? 'bg-cyan-50 text-cyan-600 border border-cyan-100 shadow-xs' : 'text-slate-500 hover:bg-slate-50'}`}>📅 Book Consultation</button>
            <button onClick={() => setActiveTab('status')} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeTab === 'status' ? 'bg-cyan-50 text-cyan-600 border border-cyan-100 shadow-xs' : 'text-slate-500 hover:bg-slate-50'}`}>⏳ Active Check-In & Bill</button>
          </nav>
        </div>
        <div className="pt-4 border-t border-slate-100">
          <Link to="/" onClick={() => { localStorage.removeItem("patientName"); localStorage.removeItem("patientId"); localStorage.removeItem("userId"); localStorage.removeItem("userRole"); }} className="flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-xs uppercase text-rose-600 hover:bg-rose-50">🚪 Logout</Link>
        </div>
      </aside>

      {/* Stage */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10 max-w-7xl mx-auto w-full">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Welcome, {patientName}</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase">Profile Status: <span className="text-cyan-600 font-bold">Verified Medical Client</span></p>
        </header>

        {activeTab === 'book' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs lg:col-span-2 space-y-4">
              <h3 className="text-lg font-black text-slate-800">Schedule Your Appointment</h3>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Select Registered Doctor</label>
                  <select 
                    value={bookingForm.doctorId} 
                    onChange={(e) => setBookingForm({ ...bookingForm, doctorId: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden"
                  >
                    <option value="">-- Choose Doctor from DB --</option>
                    {doctorsList.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calendar Date & Time Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Appointment Date</label>
                    <input 
                      type="date" 
                      min={todayStr}
                      value={bookingForm.date} 
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Time Slot</label>
                    <input 
                      type="text" 
                      value={bookingForm.time} 
                      onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })} 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Chief Complaint</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Regular checkup" 
                    value={bookingForm.reason} 
                    onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden" 
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all cursor-pointer">
                  {isSubmitting ? "Processing..." : "Confirm Booking Slot"}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'status' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="text-lg font-black text-slate-800">Your Live Care Status Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400">
                    <th className="py-3 px-4">Doctor</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Current Queue #</th>
                    <th className="py-3 px-4">Status & Room</th>
                    <th className="py-3 px-4">EHR Prescription</th>
                    <th className="py-3 px-4">Billing Status</th>
                    <th className="py-3 px-4 text-right">Payment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                  {myAppointments.map((app) => (
                    <tr key={app.id}>
                      <td className="py-4 px-4 font-bold text-slate-800">
                        {app.doctorName || app.doctor?.name || "Unassigned"}
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-500">
                        <div>{app.date || todayStr}</div>
                        <div className="text-[10px] text-slate-400">{app.time}</div>
                      </td>
                      <td className="py-4 px-4 font-mono text-cyan-600 font-black">
                        {app.status === 'Waiting' ? `#${app.queueNumber}` : '—'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-black ${
                          app.status === 'Waiting' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          app.status === 'Checked In' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          app.status === 'In Progress' ? 'bg-purple-50 text-purple-600 border border-purple-100 animate-pulse' :
                          'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                          {app.status === 'Checked In' ? `Checked In (${app.roomNumber || 'Awaiting Room'})` : app.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500">
                        {app.prescription ? (
                          <div className="bg-cyan-50/50 p-2 border border-cyan-100/60 rounded-md text-[11px] text-cyan-900 font-medium">
                            💊 <strong>Rx:</strong> {app.prescription}
                          </div>
                        ) : (
                          <span className="text-slate-300 italic">No prescription logged yet</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-700">
                        ${app.billingAmount ? app.billingAmount.toFixed(2) : "Calculating..."}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {app.status === 'Completed' && app.paymentStatus !== 'Paid' ? (
                          <button onClick={() => handlePayment(app.id)} className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[9px] uppercase font-black tracking-widest rounded-lg animate-pulse cursor-pointer">
                            💳 Pay Now
                          </button>
                        ) : app.paymentStatus === 'Paid' ? (
                          <span className="text-emerald-600 font-bold uppercase text-[10px]">🟢 Paid & Cleared</span>
                        ) : (
                          <span className="text-slate-300 italic">Awaiting clinical completion</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Patient;