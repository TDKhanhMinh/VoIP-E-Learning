import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import TextInput from "../components/TextInput";

export default function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/home")
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-300 p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-600 text-sm">Login to continue to your account</p>
            </div>

            {error && (
              <div className="mb-4 text-red-600 text-sm text-center bg-red-100 py-2 px-4 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <TextInput
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <TextInput
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <TextInput
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-green-800 font-medium">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 focus:ring-4 focus:ring-green-200 transition-all transform hover:-translate-y-0.5"
              >
                Sign In
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don’t have an account?{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-100 to-blue-700 items-center justify-center p-10">
          <div className="text-center text-white max-w-sm">
            <h2 className="text-2xl font-bold mb-2 uppercase">Welcome to ton duc thang university</h2>
            <img
              src={'https://tse2.mm.bing.net/th/id/OIP.-1gFbzqXrbFGv-HVHET5TAHaHa?r=0&w=960&h=960&rs=1&pid=ImgDetMain&o=7&rm=3'}
              alt="Login illustration"
              className="rounded-xl shadow-lg mb-6"
            />

          </div>
        </div>
      </div>
    </div>
  );
}
