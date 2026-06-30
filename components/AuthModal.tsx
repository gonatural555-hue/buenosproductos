"use client";

import { useEffect } from "react";
import AuthForm from "@/components/AuthForm";
import GiAuthExperienceShell from "@/components/auth/GiAuthExperienceShell";

type Props = {
  open: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
};

export default function AuthModal({ open, onClose, initialTab = "login" }: Props) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <GiAuthExperienceShell mode="modal" onClose={onClose} showClose>
      <AuthForm initialTab={initialTab} onSuccess={onClose} isPage={false} />
    </GiAuthExperienceShell>
  );
}
