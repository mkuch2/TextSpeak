import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Protect routes that require authentication
  useEffect(() => {
    if (!session && location.pathname === '/create-post') {
      navigate('/login');
    }
  }, [session, location.pathname, navigate]);

  return (
    <>
      <nav className="p-4 bg-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src={viteLogo} className="h-8" alt="Vite logo" />
              <img src={reactLogo} className="h-8" alt="React logo" />
              <span className="text-xl font-bold">TextSpeak</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link 
                  to="/create-post" 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Create Post
                </Link>
                <button 
                  onClick={() => supabase.auth.signOut()} 
                  className="text-gray-600 hover:text-gray-800"
                >
                  Sign Out
                </button>
                <span className="text-gray-600">
                  {session.user.email}
                </span>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4">
        <Outlet />
      </main>
    </>
  )
}

export default App
