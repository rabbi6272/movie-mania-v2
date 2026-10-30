import { Spinner } from "@heroui/react";

export function Loader() {
  return (
    <div className="m-auto flex flex-col items-center gap-2">
      <Spinner size="lg" color="current" className="text-gray-500" />
      <p className="text-gray-500 text-md">Loading...</p>
    </div>
  );
}
