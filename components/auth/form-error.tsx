import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

const FormError = ({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) => {
  if (!message) return;

  return (
    <div
      className={cn(
        "flex gap-x-1 text-red-500 bg-amber-500/10 p-3 border border-red-500/50 rounded-sm mb-4 -mt-2",
        className
      )}
    >
      <TriangleAlert className="flex-shrink-0 w-[16px] h-[16px] mt-0.5" />
      <span className="text-sm text-left">{message}</span>
    </div>
  );
};
export default FormError;
