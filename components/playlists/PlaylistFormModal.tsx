"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button, Input, Label, Spinner, TextArea } from "@heroui/react";

import { ModalShell } from "./ModalShell";

export function PlaylistFormModal({
  title,
  submitLabel,
  initial = { name: "", description: "" },
  onSubmit,
  onClose,
}: {
  title: string;
  submitLabel: string;
  initial?: { name: string; description: string };
  onSubmit: (values: { name: string; description: string }) => Promise<{
    success: boolean;
    message: string;
  }>;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Please give your playlist a name");
      return;
    }

    try {
      setIsSubmitting(true);
      const { success, message } = await onSubmit({ name, description });
      if (success) {
        toast.success(message);
        onClose();
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalShell title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label
            htmlFor="playlist-name"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            Name
          </Label>
          <Input
            fullWidth
            id="playlist-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Favorites, 90s Classics"
            maxLength={60}
            autoComplete="off"
          />
        </div>

        <div>
          <Label
            htmlFor="playlist-description"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </Label>
          <TextArea
            fullWidth
            id="playlist-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this playlist for?"
            maxLength={200}
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onPress={onClose} className="rounded-full">
            Cancel
          </Button>
          <Button type="submit" isPending={isSubmitting} className="rounded-full">
            {isSubmitting && <Spinner size="sm" color="current" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}