import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => register(name, email, password),
    onSuccess: () => {
      setErrorMessage("");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      let message = "Registration failed. Please try again."; // Default message
      if (error?.response?.data) {
        if (error.response.data.errors) {
          const firstErrorKey = Object.keys(error.response.data.errors)[0];
          message = error.response.data.errors[firstErrorKey][0] || message;
        }
        else if (error.response.data.message) {
          message = error.response.data.message;
        }
      } else if (error?.message) {
        message = error.message;
      }

      setErrorMessage(message);
      console.error("Registration failed:", error.response?.data || error);
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
      if (errorMessage) setErrorMessage("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errorMessage && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-2">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                  errorMessage ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Full Name"
                value={name}
                onChange={handleNameChange}
                disabled={mutation.isLoading}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                  errorMessage ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Email address"
                value={email}
                onChange={handleEmailChange}
                disabled={mutation.isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                  errorMessage ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                disabled={mutation.isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {mutation.isLoading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;