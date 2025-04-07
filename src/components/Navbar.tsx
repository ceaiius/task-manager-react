// src/components/Navbar.tsx
import { useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext'; 
import { logout as apiLogout } from '../api/auth'; 
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  if (!auth) {
    return null;
  }

  const { isAuthenticated, user, logout: contextLogout } = auth;

  const handleLogout = async () => {
    try {
        await apiLogout();
    } catch(error) {
        console.error("API Logout failed:", error);
    } finally {
        contextLogout();
        navigate("/login"); 
    }
  };

  return (
    <>
     <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
          {!isAuthenticated && ( 
            <Link to="/" className="text-default-red dark:hover:text-white font-bold text-xl flex-shrink-0">
                TaskManager
            </Link>
          )}
            {isAuthenticated && (
              <div className="hidden md:block">
                <div className="flex items-baseline space-x-4">
                  <Link
                    to="/dashboard"
                    className=" text-default-red  dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-5"> 
              <ThemeToggle />
              {isAuthenticated ? (
                <>
                  
                  <Link
                    to="/profile"
                    className="flex items-center text-default-red dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                    title="Profile Settings"
                  >
              
                    {user?.name ? user.name : 'Profile'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-default-red dark:hover:bg-[hsl(210,14%,9%)] cursor-pointer text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition duration-150 ease-in-out"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex items-baseline space-x-4">
                  <Link
                    to="/login"
                    className="text-default-red dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-default-red dark:hover:text-white  px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button type="button" className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
    <hr className='dark:border-white'/>
    </>
   
    
  );
};

export default Navbar;