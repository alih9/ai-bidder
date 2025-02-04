"use client";

import { useAuth0 } from "@auth0/auth0-react";

export default function LoginPage() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
          🚀 Welcome to AI-Bidder
        </h2>
        <button
          onClick={() => loginWithRedirect()}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
