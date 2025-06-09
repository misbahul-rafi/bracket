'use client';

import { useState } from "react";
import Link from "next/link";
import Image from 'next/image';
import { useSession } from "next-auth/react";
const styleList = "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data,status } = useSession()

  console.log(status)
  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-gray-200 bg-[#de1e14]">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src="/logo.png" alt="Logo" width={120} height={24} priority />
        </Link>

        {/* Toggle Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          type="button"
          className="inline-flex items-center justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Menu */}
        <div className={`${menuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:border-gray-700">
            <li>
              <Link href="/" className={styleList}>Home</Link>
            </li>
            <li>
              <Link href="/about" className={styleList}>About</Link>
            </li>
            <li>
              <Link href="/services" className={styleList}>Services</Link>
            </li>
            <li>
              <Link href="/pricing" className={styleList}>Pricing</Link>
            </li>
            <li>
              {data?.user ? <Link href="/profiles" className={styleList}>Profiles</Link> : <Link href="/signin" className={styleList}>Sign In</Link> }

            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
