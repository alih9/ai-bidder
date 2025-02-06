"use client";

import { useAuth0 } from "@auth0/auth0-react";
import Link from "next/link";

export default function Navigation() {
  const { logout } = useAuth0();

  return (
    <nav className="bg-slate-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/proposal" className="text-white hover:text-blue-200">
            Generate Proposal
          </Link>
          <Link href="/profiles" className="text-white hover:text-blue-200">
            Profiles
          </Link>
        </div>
        <button
          onClick={() =>
            logout({
              logoutParams: {
                returnTo:
                  process.env.NEXT_PUBLIC_AUTH_URL ||
                  "https://ai-bidder.vercel.app",
              },
            })
          }
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
