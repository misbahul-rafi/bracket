'use client';
import { FaUserAlt } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";

export default function Page() {
  const { data } = useSession()
  if (!data) return "Loading"
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <section className="shadow-xl rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <FaUserAlt size={100} />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-zinc-800 ">{data.user.username}</h1>
          <p>Role: {data.user.role}</p>
        </div>
        <button className="border rounded-lg px-3 py-1" onClick={handleLogout}>Logout</button>
      </section>
    </main>
  );
}
