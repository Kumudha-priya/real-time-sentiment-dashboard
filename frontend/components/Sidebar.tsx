"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="hidden lg:block w-60 h-screen bg-gray-900 text-white p-4">
      <ul className="space-y-4">

        <li>
          <Link href="/" className="hover:text-blue-400">
            Home
          </Link>
        </li>

        <li>
          <Link href="/dataset" className="hover:text-blue-400">
            Dataset
          </Link>
        </li>

        <li>
          <Link href="/charts" className="hover:text-blue-400">
            Charts
          </Link>
        </li>

        <li>
          <Link href="/dashboard" className="hover:text-blue-400">
            Dashboard
          </Link>
        </li>

        <li>
          <Link href="/live" className="hover:text-blue-400">
            Live Feed
          </Link>
        </li>

      </ul>
    </div>
  );
}