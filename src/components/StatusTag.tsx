import { StatusType } from "@/types/types";

const statusStyles: Record<StatusType, string> = {
  VALID: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20",
  NON_VALID: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
  REDIRECTED: "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20",
};

interface StatusTagProps {
  status: StatusType;
}

export default function StatusTag({ status }: StatusTagProps) {
  const baseStyles = "inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium";
  const colorStyles = statusStyles[status] || "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20";

  return (
    <span className={`${baseStyles} ${colorStyles}`}>
      {status}
    </span>
  );
} 