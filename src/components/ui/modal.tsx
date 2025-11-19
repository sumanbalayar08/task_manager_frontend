// components/modal.tsx
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  hideCloseButton?: boolean;
}

export default function Modal({
  open,
  setOpen,
  title,
  children,
  size = "md",
  hideCloseButton,
}: ModalProps) {
  const sizeClass =
    size === "sm"
      ? "max-w-md"
      : size === "md"
      ? "max-w-2xl"
      : size === "lg"
      ? "max-w-4xl"
      : "max-w-5xl";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />

        {/* Content */}
        <Dialog.Content
          className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6 w-full ${sizeClass} max-h-[90vh] overflow-y-auto z-50`}
        >
          {title && (
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
              {!hideCloseButton && (
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          )}

          <div className="relative">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
