import React from 'react';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();
  // Navigation handler placeholders
 const handleLogin = () => {
  navigate('/login');
};
 const handleSignUp = () => {
  navigate('/signup'); // Changes the path to your signup route
};

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white antialiased overflow-x-hidden scroll-smooth">
      
      {/* 1. ULTRA-CLEAN MODERN NAVIGATION BAR */}
      <header className="border-b border-slate-200/60 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20 group-hover:scale-105 transition duration-300">
              M
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Medi<span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Sphere</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-10 text-sm font-bold tracking-wide text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors duration-200">Core Modules</a>
            <a href="#metrics" className="hover:text-blue-600 transition-colors duration-200">Performance Metrics</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button onClick={handleLogin} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
              Login
            </button>
            <button 
              onClick={handleSignUp} 
              className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 transition-all active:scale-[0.97] cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CANVAS */}
      <main className="grow">
        
        {/* 2. PREMIUM HERO SECTION WITH LIGHT RADIAL GRID */}
        <section className="relative bg-gradient-to-b from-blue-50/40 via-[#f8fafc] to-[#f8fafc] py-20 lg:py-32 border-b border-slate-200/60 overflow-hidden">
          
          {/* Subtle geometric light-grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 border border-blue-200 rounded-full">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Enterprise Clinical Network
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
                The architecture of secure <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">clinical care.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                A premium, high-performance infrastructure coordinating cross-subnet database registries, telemetry routing paths, and critical medical audits cleanly.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-2">
                <button 
                  onClick={handleSignUp}
                  className="w-full sm:w-auto px-8 py-4 text-sm font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Deploy Live App
                </button>
                <a 
                  href="#features" 
                  className="w-full sm:w-auto px-8 py-4 text-sm font-bold uppercase tracking-wider text-slate-700 bg-slate-200/60 hover:bg-slate-200 rounded-xl text-center transition-all border border-slate-300/80 shadow-xs"
                >
                  View Specifications
                </a>
              </div>
            </div>

            {/* Right Rich Image Grid Column */}
            <div className="lg:col-span-6 grid grid-cols-12 gap-4 relative">
              <div className="col-span-7 space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-white h-64 group">
                  <img 
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80" 
                    alt="Modern medical laboratory equipment" 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-white h-44 group">
                  <img 
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80" 
                    alt="Clinical dashboard data charts" 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="col-span-5 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-white h-80 group">
                  <img 
                    src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=600&q=80" 
                    alt="Doctor interacting with high-end tech tablet" 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. CORE MODULES SECTION */}
        <section id="features" className="bg-[#f8fafc] py-24 border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100/60 px-3 py-1 rounded-full border border-blue-200">
                Platform Blueprint
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Engineered for High-Impact Performance
              </h2>
              <p className="text-sm sm:text-base text-slate-500">
                Eliminate orchestration failures across infrastructure subsystems while keeping data arrays highly secure.
              </p>
            </div>

            {/* Grid Layout of Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Feature 1 - Fixed & Verified Image */}
              <div className="bg-[#f1f5f9] rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-52 overflow-hidden relative bg-slate-200">
                  <img 
                    src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80" 
                    alt="Modern Emergency Room Hospital Infrastructure Monitoring" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">Routing Layer</div>
                  <h3 className="text-lg font-bold text-slate-900">Smart System Allocations</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Coordinate dynamic medical rotations and handle appointment pipelines using an elegant core matrix logic.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#f1f5f9] rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-52 overflow-hidden relative bg-slate-200">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80" 
                    alt="Medical Analysis Setup" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <div className="text-xs font-mono font-bold text-cyan-600 uppercase tracking-wider">Database Mesh</div>
                  <h3 className="text-lg font-bold text-slate-900">Structured Digital Registries</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Consolidate localized file histories, laboratory timelines, and real-time records into clear datasets.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#f1f5f9] rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-52 overflow-hidden relative bg-slate-200">
                  <img 
                    src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80" 
                    alt="Secure Infrastructure Vault" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <div className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">Security Core</div>
                  <h3 className="text-lg font-bold text-slate-900">Cryptographic Safe Audit</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Isolate critical server processes behind granular tokens while monitoring access pathways logs transparently.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. KEY PLATFORM METRICS */}
        <section id="metrics" className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_45%)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-blue-400">99.99%</div>
                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">Network Uptime</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-cyan-400">&lt; 45ms</div>
                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">Telemetry Latency</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-indigo-400">256-bit</div>
                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">Mesh Encryption</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-emerald-400">Zero</div>
                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">Orchestration Faults</div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. PREMIUM CALL-TO-ACTION PROMPT BANNER */}
        <section className="relative py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 overflow-hidden text-white">
          <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none"></div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight">Connect Your Live Data Layer Now</h3>
            <p className="text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Map your application clusters and Spring Boot endpoints straight into our interface mesh structure to view client-side dashboard components synchronizing instantly.
            </p>
            <div className="pt-4">
              <button 
                onClick={handleSignUp}
                className="px-8 py-4 bg-white text-blue-700 font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-slate-50 transition shadow-xl shadow-blue-900/30 cursor-pointer active:scale-[0.98]"
              >
                Launch Production App
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 6. MODERN LIGHT FOOTER */}
      <footer className="bg-slate-950 py-12 text-slate-400 text-xs font-medium tracking-wider border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="text-base font-black text-white tracking-tight">Medi<span className="text-blue-500">Sphere</span></span>
          <p className="text-slate-500 font-mono text-center sm:text-right">&copy; {new Date().getFullYear()} MediSphere Architecture Group. All platform pathways verified.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;