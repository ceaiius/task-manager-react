import { useContext } from 'react'; 
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext'; 

const Navbar = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext); 

  const handleLogout = () => {
 
    if (auth?.logout) {
        auth.logout();
    } else {

        localStorage.removeItem("token");
    }
    navigate("/login"); 
  };

  const isAuthenticated = auth?.isAuthenticated ?? false;

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">

            {!isAuthenticated && ( 
                <Link to="/" className="text-white font-bold text-xl flex-shrink-0">
                    TaskManager
                </Link>
            )}

             {isAuthenticated && (
                <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                        <Link
                        to="/dashboard"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                        >
                        Dashboard
                        </Link>
                    </div>
                </div>
             )}
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition duration-150 ease-in-out"
                >
                  Logout
                </button>
              ) : (
                <div className="flex items-baseline space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition duration-150 ease-in-out"
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
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;