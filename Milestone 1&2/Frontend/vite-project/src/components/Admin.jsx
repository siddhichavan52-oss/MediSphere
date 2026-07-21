import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const API_BASE = "http://localhost:8081/api/clinical";

  // Date filtering state (default: today's date YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [appointments, setAppointments] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [roomSelections, setRoomSelections] = useState({});
  const [insuranceOffsets, setInsuranceOffsets] = useState({});

  const fetchAdminTelemetry = useCallback(async () => {
    try {
      const appRes = await fetch(`${API_BASE}/appointments`);
      const appData = await appRes.json();
      setAppointments(appData);

      const docRes = await fetch(`${API_BASE}/doctors`);
      const docData = await docRes.json();

      // Ensure each doctor appears only once in state by deduplicating by unique ID or name
      const uniqueDoctors = Array.from(
        new Map(docData.map(doc => [doc.id || doc.name, doc])).values()
      );
      setDoctorsList(uniqueDoctors);

      // Diagnostic audit logs
      setAuditLogs([
        { id: 1, text: "Admin assigned patient checked-in room parameter update to Room 3", user: "system_root", status: "INFO" },
        { id: 2, text: "Prescription update triggered and committed fully to Sarah Jenkins' vault", user: "dr_amina", status: "SUCCESS" },
        { id: 3, text: "Financial invoice balance reconciled with $45.00 insurance deduction", user: "billing_bot", status: "FINANCIAL" }
      ]);
    } catch (err) {
      console.error("Admin data sync dropped:", err);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchAdminTelemetry();
    const interval = setInterval(fetchAdminTelemetry, 5000);
    return () => clearInterval(interval);
  }, [fetchAdminTelemetry]);

  const handleCheckIn = async (id) => {
    const assignedRoom = roomSelections[id] || "Room 1";
    try {
      const res = await fetch(`${API_BASE}/appointments/${id}/checkin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomNumber: assignedRoom })
      });
      if (res.ok) {
        alert(`Checked in! Doctor has been notified: Patient is in ${assignedRoom}.`);
        fetchAdminTelemetry();
      }
    } catch (err) {
      console.error("Error during check-in mapping:", err);
    }
  };

  const handleFinalizeBill = async (id, currentFee) => {
    const deduction = parseFloat(insuranceOffsets[id] || 0);
    const finalAmount = Math.max(0, currentFee - deduction);

    try {
      const res = await fetch(`${API_BASE}/appointments/${id}/finalize-bill`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finalBill: finalAmount })
      });
      if (res.ok) {
        alert(`Bill finalized. Sent to patient dashboard: $${finalAmount.toFixed(2)} (Insurance offset applied).`);
        fetchAdminTelemetry();
      }
    } catch (err) {
      console.error("Error writing bill details:", err);
    }
  };

  // Helper function to normalize date strings to YYYY-MM-DD
  const normalizeDate = (rawDate) => {
    if (!rawDate) return todayStr;
    if (rawDate.includes('T')) return rawDate.split('T')[0];
    return rawDate;
  };

  // Strictly filter appointments for the chosen date
  const filteredAppointments = appointments.filter(a => {
    const appDate = normalizeDate(a.date);
    return appDate === selectedDate;
  });

  const revenueToday = appointments
    .filter(a => a.paymentStatus === 'Paid' && normalizeDate(a.date) === selectedDate)
    .reduce((sum, a) => sum + (a.billingAmount || 0), 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 font-sans antialiased relative flex overflow-hidden">
      {/* Visual Ambience Grid */}
      <div className="absolute top-[-25%] right-[-10%] w-[700px] h-[700px] bg-indigo-100/40 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-30 pointer-events-none"></div>

      {/* Admin Side Nav */}
      <aside className="w-68 bg-white/90 backdrop-blur-xl border-r border-slate-200 p-6 flex flex-col justify-between relative z-10 shrink-0 hidden md:flex">
        <div className="space-y-9">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900 rounded-xl flex items-center justify-center text-white font-black shadow-lg">A</div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block">MediSphere</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 block mt-0.5">Admin Central</span>
            </div>
          </div>
          <nav className="space-y-1.5">
            <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-bold text-xs uppercase transition-all ${activeTab === 'bookings' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs' : 'text-slate-500 hover:bg-slate-50'}`}>📅 Booking Manager</button>
            <button onClick={() => setActiveTab('audit')} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-bold text-xs uppercase transition-all ${activeTab === 'audit' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs' : 'text-slate-500 hover:bg-slate-50'}`}>🛡️ Compliance Audits</button>
          </nav>
        </div>
        <div className="pt-4 border-t border-slate-100">
          <Link to="/" onClick={() => { localStorage.removeItem("userId"); localStorage.removeItem("userRole"); }} className="flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-xs uppercase text-rose-600 hover:bg-rose-50">🚪 Lock Panel</Link>
        </div>
      </aside>

      {/* Control Stage */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10 max-w-7xl mx-auto w-full">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Admin Core Control</h1>
            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase">Authentication Status: <span className="text-indigo-600 font-bold">Root Console</span></p>
          </div>

          {/* Schedule Date Filter Control */}
          <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-xs flex items-center space-x-3">
            <label className="text-[10px] font-black uppercase text-slate-400">Filter Schedule Date:</label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold text-indigo-600 bg-slate-50 px-2 py-1 rounded border border-slate-200 focus:outline-hidden cursor-pointer"
            />
          </div>
        </header>

        {/* Analytics Feed */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <span className="block text-[10px] font-black uppercase text-slate-400">Total System Doctors</span>
            <span className="block text-3xl font-black text-slate-800 mt-1">{doctorsList.length}</span>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <span className="block text-[10px] font-black uppercase text-slate-400">Queue Load ({selectedDate})</span>
            <span className="block text-3xl font-black text-slate-800 mt-1">
              {filteredAppointments.filter(a => a.status !== 'Completed').length} active
            </span>
          </div>
          <div className="p-5 bg-gradient-to-br from-indigo-950 to-indigo-900 text-white rounded-2xl shadow-md">
            <span className="block text-[10px] font-black uppercase text-indigo-300">Revenue Received ({selectedDate})</span>
            <span className="block text-3xl font-black mt-1">${revenueToday.toFixed(2)}</span>
          </div>
        </section>

        {activeTab === 'bookings' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-800">Master Schedule Clinic Dashboard</h3>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Showing Date:</span>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  {selectedDate}
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400">
                    <th className="py-3 px-4">Patient Profile</th>
                    <th className="py-3 px-4">Assigned Doctor</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Encounter Status</th>
                    <th className="py-3 px-4">Real-Time Actions</th>
                    <th className="py-3 px-4 text-right">Insurance Ledger Finalization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-semibold">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-800">{app.patientName || app.patient?.name || "Patient #" + app.patientId}</td>
                        
                        <td className="py-4 px-4 font-semibold text-slate-700">
                          Dr. {app.doctorName || app.doctor?.name || app.doctor?.fullName || app.doctorUsername || 'Unassigned'}
                        </td>

                        <td className="py-4 px-4 font-mono text-slate-500">
                          <div>{normalizeDate(app.date)}</div>
                          <div className="text-[10px] text-slate-400">{app.time}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase font-black ${
                            app.status === 'Waiting' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            app.status === 'Checked In' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            app.status === 'In Progress' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                            'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            {app.status} {app.roomNumber && `(${app.roomNumber})`}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {app.status === 'Waiting' ? (
                            <div className="flex items-center space-x-2">
                              <select 
                                onChange={(e) => setRoomSelections({ ...roomSelections, [app.id]: e.target.value })}
                                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold"
                              >
                                <option value="Room 1">Room 1</option>
                                <option value="Room 2">Room 2</option>
                                <option value="Room 3">Room 3</option>
                              </select>
                              <button onClick={() => handleCheckIn(app.id)} className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[9px] uppercase font-black rounded cursor-pointer">
                                Check-In
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-300 italic">No further actions required</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {app.status === 'Completed' && app.paymentStatus !== 'Paid' ? (
                            <div className="flex items-center justify-end space-x-2">
                              <span className="text-[10px] text-slate-400">Deduct Insurance ($):</span>
                              <input 
                                type="number" 
                                placeholder="0" 
                                className="w-16 px-1.5 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-mono text-center"
                                onChange={(e) => setInsuranceOffsets({ ...insuranceOffsets, [app.id]: e.target.value })}
                              />
                              <button onClick={() => handleFinalizeBill(app.id, app.billingAmount || 150.00)} className="px-2 py-1 bg-indigo-600 text-white text-[9px] uppercase font-black rounded cursor-pointer">
                                Send Bill
                              </button>
                            </div>
                          ) : app.paymentStatus === 'Paid' ? (
                            <span className="text-emerald-600 font-bold uppercase text-[9px]">🟢 Bill Settled</span>
                          ) : (
                            <span className="text-slate-300 italic">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400 italic">
                        📅 No appointments found for <strong className="text-slate-600 font-semibold">{selectedDate}</strong>. Use the date selector above to check a different date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-lg font-black text-slate-800">Security & Operational Logs</h3>
            <div className="space-y-2">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-indigo-600 font-mono font-bold">[{log.status}]</span>
                    <span className="text-slate-600">{log.text}</span>
                  </div>
                  <span className="text-slate-400 font-bold font-mono">By: {log.user}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;