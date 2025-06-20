'use client';

import { useRouter } from "next/navigation";
import ModalAddTeam from "@/components/ModalAddTeam";
import { useQueryClient } from "@tanstack/react-query";

export default function NewTeamPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleClose = () => router.back();
  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['teams'] });
    router.push("/profiles")
  };

  return (
    <ModalAddTeam
      onClose={handleClose}
      onSucces={handleSuccess}
      isFullPage
    />
  );
}
