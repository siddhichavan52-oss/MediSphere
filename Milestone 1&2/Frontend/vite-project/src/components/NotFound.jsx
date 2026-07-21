import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white antialiased overflow-x-hidden relative justify-center items-center py-12 px-4 sm:px-6 lg:px-8">

      {/* Subtle geometric light-grid overlay to match the rest of the app */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-2xl border border-slate-200/80 shadow-xl relative z-10 text-center">
        <div className="inline-flex w-12 h-12 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl items-center justify-center text-white font-black shadow-lg shadow-blue-500/20 mx-auto">
          M
        </div>
        <h1 className="text-6xl font-black tracking-tight text-slate-900">404</h1>
        <p className="text-sm text-slate-500">
          This node doesn't exist on the MediSphere network.
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-3 text-sm font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 transition-all active:scale-[0.98]"
        >
          &larr; Return to main canvas
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
