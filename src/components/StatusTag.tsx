import { StatusType } from "@/types/types";

const statusStyles: Record<StatusType, string> = {
  VALID: "bg-green-100 text-green-800",
  NON_VALID: "bg-red-100 text-red-800",
  REDIRECTED: "bg-yellow-100 text-yellow-800",
};

interface StatusTagProps {
  status: StatusType;
}

export default function StatusTag({ status }: StatusTagProps) {
  const baseStyles = "px-2 py-1 rounded-full text-xs font-medium inline-block";
  const colorStyles = statusStyles[status] || "bg-gray-100 text-gray-800";

  return (
    <span className={`${baseStyles} ${colorStyles}`}>
      {status}
    </span>
  );
} 