import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/SignUp'; // Make sure the file path matches your project structure
import Login from './components/Login';
import Patient from './components/Patient';
import Doctor from './components/Doctor'; // Import the Doctor component
import Admin from './components/Admin'; // Import the Admin component
import AuthGuard from './components/AuthGuard'; // Protects dashboard routes by login/role
import NotFound from './components/NotFound';
function App() {
  return (
    <Router>
      <Routes>
        {/* Define the base route for your Home page */}
        <Route path="/" element={<Home />} />
        
        {/* Define the matching target route for your Sign Up page */}
        <Route path="/signup" element={<SignUp />} />

        <Route path="/login" element={<Login />} />
        <Route path="/patient-dashboard" element={<AuthGuard role="Patient"><Patient /></AuthGuard>} />
        <Route path="/doctor-dashboard" element={<AuthGuard role="Doctor"><Doctor /></AuthGuard>} /> {/* Add the Doctor route */}
        <Route path="/admin-dashboard" element={<AuthGuard role="Admin"><Admin /></AuthGuard>} /> {/* Add the Admin route */}

        {/* Catch-all fallback for any unknown route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
