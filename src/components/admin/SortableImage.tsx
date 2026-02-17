import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import Image from "next/image";

interface SortableImageProps {
  id: string;
  url: string;
  isUploading: boolean;
  onRemove: () => void;
}

export function SortableImage({ id, url, isUploading, onRemove }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative aspect-square rounded-md border overflow-hidden group bg-gray-100 touch-none ${
        isDragging ? "ring-2 ring-primary" : ""
      }`}
    >
      <Image
        src={url}
        alt="Product"
        width={100}
        height={100}
        className={`object-cover w-full h-full pointer-events-none select-none ${
          isUploading ? "opacity-50" : "opacity-100"
        }`}
      />
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()} // Prevent drag start when clicking remove
        onClick={onRemove}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 transition-colors z-10 cursor-pointer"
        title="Remove image"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
