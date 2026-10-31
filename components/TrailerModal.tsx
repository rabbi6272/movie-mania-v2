"use client";
import { Modal } from "@heroui/react";

export default function TrailerModal({ videoKey, onClose }) {
  if (!videoKey) return null;

  return (
    <Modal.Backdrop variant="blur" isOpen onOpenChange={(open) => !open && onClose()} className="bg-black/80">
      <Modal.Container size="cover">
        <Modal.Dialog aria-label="Movie Trailer" className="bg-transparent shadow-none p-0 max-w-4xl">
          <Modal.CloseTrigger className="text-white" />
          <div className="relative w-full aspect-video mt-10">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl"
            />
          </div>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
