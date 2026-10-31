"use client";
import { Modal } from "@heroui/react";

export function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  // Parents mount this only while open, so it is always open; HeroUI handles Escape, backdrop click, focus and scroll lock.
  return (
    <Modal.Backdrop variant="blur" isOpen onOpenChange={(open) => !open && onClose()}>
      <Modal.Container size="sm">
        <Modal.Dialog aria-label={title}>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading className="text-lg font-bold text-gray-900 font-nunito">{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>{children}</Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
