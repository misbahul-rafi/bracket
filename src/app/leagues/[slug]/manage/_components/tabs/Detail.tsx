'use client'

import { League, Esport } from "@prisma/client";
import { useState } from "react";
import ModalDeleteLeague from "../ModalDeleteLeague";
import { useDeleteLeague } from "@/hooks/leagues";
import { useRouter } from "next/navigation";

type Props = {
  league: League & { esport: Esport };
};

export default function Detail({ league }: Props) {
  const [action, setAction] = useState<"" | "edit" | "delete">("")
  const router = useRouter()
  const deleteLeague = useDeleteLeague(() => router.push("/"))
  const onCancel = () => {
    setAction("")
  }
  const onDelete = () => {
    deleteLeague.mutate(league.slug)
  }

  return (
    <section className="p-6 rounded-lg shadow-md">
      <header className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold text-[#de1e14] flex-4 mb-4">League Detail</h1>
        <div className="flex flex-row gap-3 flex-1 w-full items-center">
          <button 
          onClick={()=> setAction("edit")}
          className="border w-full bg-white hover:bg-gray-200">Edit</button>
          <button 
          onClick={()=> setAction("delete")}
          className="border w-full bg-white hover:bg-gray-200">Delete</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium">Name:</p>
          <p>{league.name}</p>
        </div>
        <div>
          <p className="font-medium">Code:</p>
          <p>{league.code}</p>
        </div>
        <div>
          <p className="font-medium">Slug:</p>
          <p>{league.slug}</p>
        </div>
        <div>
          <p className="font-medium">Region:</p>
          <p>{league.region}</p>
        </div>
        <div>
          <p className="font-medium">Season:</p>
          <p>{league.season}</p>
        </div>
        <div>
          <p className="font-medium">Group Status:</p>
          <p className={league.groupIsLock ? "text-red-500" : "text-green-500"}>
            {league.groupIsLock ? "Locked" : "Open"}
          </p>
        </div>
        <div>
          <p className="font-medium">Created At:</p>
          <p>{new Date(league.createdAt).toLocaleString()}</p>
        </div>
        <div>
          <p className="font-medium">Esport:</p>
          <p>{league.esport.name}</p>
        </div>
      </div>

      {action === "delete" && <ModalDeleteLeague onCancel={onCancel} onConfirm={onDelete} />}
    </section>
  );
}