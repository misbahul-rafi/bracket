'use client'
import { useRouter } from "next/navigation";
import { RxLockClosed } from "react-icons/rx";

export default function Unauthorized() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <main>
      <div className="w-120 h-60 border mx-auto bg-[#ff0000] rounded-lg px-2 pt-2 pb-5">
        <section className="flex gap-1 pb-5">
          <div className="w-4 h-4 border rounded-full bg-red-500" />
          <div className="w-4 h-4 border rounded-full bg-[#FFEB00]" />
          <div className="w-4 h-4 border rounded-full bg-[#6EC207]" />
        </section>

        <section className="w-full h-9/10 bg-white rounded-lg p-4">
          <div className="flex h-4/5">
            <div className="p-3 flex-1 flex justify-center items-center">
              <RxLockClosed size={80} />
            </div>
            <div className="flex-2 flex justify-center
          flex-col">
              <h3 className="border-l pl-3">Unauthorized</h3>
              <p className="border-l pl-3">This page cannot access</p>
            </div>
          </div>
          <button className="px-2 border-b" onClick={handleBack}>Back</button>
        </section>
      </div>
    </main>
  );
}