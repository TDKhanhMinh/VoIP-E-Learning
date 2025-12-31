import React from "react";
import { BookOpen, Home, ArrowLeft, Sparkles } from "lucide-react";

export default function LMS404Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-75"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-150"></div>
      </div>

      <div className="max-w-3xl w-full text-center relative z-10">
        <div className="absolute -top-6 left-1/4 text-yellow-400">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div className="absolute top-10 right-1/4 text-pink-400">
          <Sparkles className="w-5 h-5 animate-pulse delay-75" />
        </div>

        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
            <BookOpen
              className="relative w-40 h-40 text-indigo-600 animate-bounce"
              strokeWidth={1.5}
            />
            <div className="absolute -top-3 -right-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full w-12 h-12 flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-2xl font-bold text-white">?</span>
            </div>
          </div>
        </div>

        <h1 className="text-9xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-pulse">
          404
        </h1>

        <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
          Không tìm thấy trang bạn đang tìm kiếm
        </h2>

        <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
          Hãy quay lại học tập nào!
        </p>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-10 text-left border border-purple-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
            <span className="text-3xl mr-3"></span>
            Mẹo nhanh để trở lại học tập
          </h3>
          <div className="space-y-3">
            <div className="flex items-start bg-indigo-50 rounded-lg p-3 transition-all hover:bg-indigo-100">
              <span className="text-indigo-600 font-bold mr-3 mt-0.5">→</span>
              <span className="text-gray-700">
                Kiểm tra lại URL bạn đã nhập
              </span>
            </div>
            <div className="flex items-start bg-purple-50 rounded-lg p-3 transition-all hover:bg-purple-100">
              <span className="text-purple-600 font-bold mr-3 mt-0.5">→</span>
              <span className="text-gray-700">
                Khóa học có thể đã được di chuyển hoặc cập nhật
              </span>
            </div>
            <div className="flex items-start bg-pink-50 rounded-lg p-3 transition-all hover:bg-pink-100">
              <span className="text-pink-600 font-bold mr-3 mt-0.5">→</span>
              <span className="text-gray-700">
                Quay lại bảng điều khiển của bạn để tìm tất cả các khóa học
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="group flex items-center gap-3 bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white transition-all shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Trang chủ
          </button>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md">
          <p className="text-gray-700 font-medium">
            Cần giúp đỡ thêm? Liên hệ với bộ phận hỗ trợ của chúng tôi tại
          </p>
          <a
            href="mailto:support@lms.com"
            className="text-indigo-600 hover:text-purple-600 font-semibold text-lg hover:underline transition-colors inline-block mt-2"
          >
            support@lms.com
          </a>
        </div>
      </div>
    </div>
  );
}
