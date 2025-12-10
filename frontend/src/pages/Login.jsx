import { useNavigate } from "react-router-dom";
// 1. Import thêm FaSpinner để làm biểu tượng loading
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
// 2. Import useState
import { useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "../components/UI/TextInput";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login } = useAuth();

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const loginData = await login(data.email, data.password);
      console.log(loginData);

      if (loginData.role === "admin") {
        navigate("/admin");
        toast.success("Login successful as Admin");
      } else if (loginData.role === "teacher") {
        navigate("/teacher");
        toast.success("Login successful as Teacher");
      } else {
        toast.success("Login successful");
        navigate("/home");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-300 p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-600 text-sm">
                Login to continue to your account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all disabled:bg-gray-100"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email format",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all disabled:bg-gray-100"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters",
                      },
                    })}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <TextInput
                    type="checkbox"
                    disabled={isLoading}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    {...register("remember")}
                  />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-blue-600 hover:text-green-800 font-medium"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-semibold transition-all transform flex items-center justify-center gap-2
                  ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed opacity-70"
                      : "bg-blue-500 hover:bg-blue-600 hover:-translate-y-0.5 text-white focus:ring-4 focus:ring-green-200"
                  }`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Processing...
                  </>
                ) : (
                  "Sign In"
                )}
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
            <h2 className="text-2xl font-bold mb-2 uppercase">
              Welcome to Ton Duc Thang University
            </h2>
            <img
              src="https://tse2.mm.bing.net/th/id/OIP.-1gFbzqXrbFGv-HVHET5TAHaHa?r=0&w=960&h=960&rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="Login illustration"
              className="rounded-xl shadow-lg mb-6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
