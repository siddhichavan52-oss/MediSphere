import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Patient'
  });

  const [message, setMessage] = useState({ text: '', isError: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', isError: false });

    try {
      const response = await fetch('http://localhost:8081/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Server response error');
      }

      const resultText = await response.text();

      if (resultText === "User Not Found" || resultText === "Password Incorrect" || resultText === "Role Incorrect") {
        setMessage({ text: resultText, isError: true });
      } else {
        setMessage({ text: "Authentication successful! Redirecting...", isError: false });
        
        // ------------------------------------------------------------------
        // FIX: Save user ID and Name explicitly to localStorage & state
        // ------------------------------------------------------------------
        localStorage.setItem('userId', resultText);
        localStorage.setItem('userRole', formData.role);
        
        // Save patient-specific keys so Patient component reads them directly
        localStorage.setItem('patientId', resultText);
        localStorage.setItem('patientName', formData.username);

        setTimeout(() => {
          if (formData.role === "Patient") {
            // Pass state dynamically during navigation
            navigate('/patient-dashboard', { 
              state: { 
                patientId: resultText, 
                patientName: formData.username 
              } 
            });
          } else if (formData.role === "Doctor") {
            navigate('/doctor-dashboard', { state: { doctorId: resultText, doctorName: formData.username } });
          } else if (formData.role === "Admin") {
            navigate('/admin-dashboard');
          } else {
            navigate('/');
          }
        }, 1500);
      }
    } catch (error) {
      setMessage({ 
        text: 'Connection to authentication cluster timed out.', 
        isError: true 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white antialiased overflow-x-hidden relative justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xl relative z-10">
        
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl items-center justify-center text-white font-black shadow-lg shadow-blue-500/20 mx-auto">
            M
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Sign In to Account
          </h2>
          <p className="text-sm text-slate-500">
            Access secure telemetry data arrays and nodes
          </p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl text-sm font-medium border ${
            message.isError 
              ? 'bg-red-50 text-red-700 border-red-200' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {message.text}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          
          <div>
            <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              System Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 placeholder-slate-400 font-medium transition"
              placeholder="Enter your system credential"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              System Security Token (Password)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 placeholder-slate-400 font-medium transition"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Verify Network Context (Role)
            </label>
            <div className="relative">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 font-medium transition cursor-pointer appearance-none"
                style={{ 
                  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23475569\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', 
                  backgroundRepeat: 'no-repeat', 
                  backgroundPosition: 'right 1rem center', 
                  backgroundSize: '1.25rem' 
                }}
              >
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-5 py-3 text-sm font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying Session...</span>
                </>
              ) : (
                <span>Initialize Core Session</span>
              )}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between pt-2 text-xs font-bold text-slate-500">
          <Link to="/" className="hover:text-blue-600 transition">
            &larr; Main Canvas
          </Link>
          <Link to="/signup" className="text-blue-600 hover:underline transition">
            Need a cluster account? Register
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;