import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 from-gray-50 to-gray-200 flex items-center justify-center p-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-4 leading-tight">
          Welcome to Task Manager
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-white mb-8">
          Your simple and effective solution to organize tasks, boost productivity, and stay on track.
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-3 bg-default-red text-white text-lg font-medium rounded-md shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;