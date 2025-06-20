'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { FaBars, FaTimes } from "react-icons/fa";
import { useEsports } from '@/hooks/esports';

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: session } = useSession();
  const { data: esports, isLoading } = useEsports();


  if (isLoading || !esports) return (
    <nav className="fixed z-10 top-0 w-full bg-[#de1e14] h-16 animate-pulse"></nav>
  );

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? "" : menu);
  };

  const closeAll = () => {
    setActiveDropdown("");
    setIsMobileOpen(false);
  };

  const createMenu = [
    { title: "League", desc: "Buat liga baru", slug: "/leagues/new" },
    { title: "Team", desc: "Buat tim baru", slug: "/teams/new" },
    { title: "Game", desc: "Buat game baru", slug: "/esports/new" },
  ];

  const userMenu = session?.user
    ? [
      { title: "My Profile", desc: "Lihat dan kelola profil Anda", slug: `/${session.user.id}/` },
      { title: "My League", desc: "Lihat liga yang Anda ikuti atau buat", slug: `/${session.user.id}/leagues/` },
      { title: "My Team", desc: "Lihat tim Anda dalam liga", slug: `/${session.user.username}/teams/` },
      { title: "Logout", desc: "Keluar dari sesi saat ini", slug: "/" },
    ]
    : [
      { title: "Sign Up", desc: "Buat akun baru untuk bergabung", slug: "/signup" },
      { title: "Sign In", desc: "Masuk ke akun Anda", slug: "/signin" },
    ];

  const renderDropdownContent = () => {
    switch (activeDropdown) {
      case "esports":
        return esports.map(game => (
          <SubBar key={game.id} title={game.name} desc="Pilih game" slug={`/esports/${game.slug}`} />
        ));
      case "create":
        return createMenu.map(item => (
          <SubBar key={item.title} title={item.title} desc={item.desc} slug={item.slug} />
        ));
      case "session":
        return userMenu.map(menu => (
          menu.title === "Logout" ? (
            <button
              key={menu.title}
              onClick={() => signOut({ callbackUrl: menu.slug })}
              className="border hover:bg-[#ff0000] w-max px-3 py-2 rounded-lg text-left"
            >
              <p className="font-semibold">{menu.title}</p>
              <span className="text-sm text-gray-100">{menu.desc}</span>
            </button>
          ) : (
            <SubBar key={menu.title} {...menu} />
          )
        ));
      default:
        return null;
    }
  };

  return (
    <nav className="navbar fixed z-10 top-0 w-full text-white">
      <div className="flex items-center justify-between px-4 py-3 md:px-10">
        <Link href="/" onClick={closeAll}>
          <Image src="/logo.png" alt="Logo" width={120} height={24} />
        </Link>

        <button
          className="md:hidden"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <div className="hidden md:flex gap-5 items-center">
          <Link href="/" onClick={closeAll}>Home</Link>
          <button onClick={() => toggleDropdown("esports")}>Esports</button>
          <button onClick={() => toggleDropdown("create")}>Create</button>
          <button onClick={() => toggleDropdown("session")}>
            {session?.user ? session.user.username : "Login"}
          </button>
        </div>
      </div>

      {(isMobileOpen || activeDropdown) && (
        <div className="md:hidden flex flex-col items-start gap-2 px-4 pb-4">
          <Link href="/" onClick={closeAll}>Home</Link>
          <button onClick={() => toggleDropdown("esports")}>Esports</button>
          <button onClick={() => toggleDropdown("create")}>Create</button>
          <button onClick={() => toggleDropdown("session")}>Profiles</button>
        </div>
      )}
      {activeDropdown && (
        <div
          className="w-full bg-[#de1e14] rounded-b-lg flex flex-col gap-3 p-4 border-t border-white"
          onClick={closeAll}
        >
          <h1 className="capitalize font-semibold">{activeDropdown}</h1>
          <div className="flex gap-3 flex-wrap">
            {renderDropdownContent()}
          </div>
        </div>
      )}
    </nav>
  );
}

const SubBar = ({ title, desc, slug = "#" }: { title: string; desc: string; slug?: string }) => (
  <Link
    href={slug}
    className="border hover:bg-[#ff0000] w-max px-3 py-2 rounded-lg"
  >
    <p className="font-semibold">{title}</p>
    <span className="text-sm text-gray-100">{desc}</span>
  </Link>
);