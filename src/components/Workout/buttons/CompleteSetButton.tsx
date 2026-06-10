import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from '@mui/icons-material/Clear';

interface CompleteSetButtonProps {
  onClick: () => void;
  isCardio?: boolean;
  isCompleted?: boolean;
}

export default function CompleteSetButton({ onClick, isCardio = false, isCompleted = false }: CompleteSetButtonProps) {
  const colorClasses = isCompleted
    ? "bg-[#3a1f1f] hover:bg-[#5a2b2b] active:bg-[#5a2b2b] text-[#ff6b6b]"
    : "bg-[#1f3a2a] hover:bg-[#2b5a3d] active:bg-[#2b5a3d] text-[#64ff9e]";

  return (
    <button
      onClick={onClick}
      className={`${isCardio ? "ml-auto" : ""} h-12 w-12 shrink-0 rounded-full flex items-center justify-center transition-colors ${colorClasses}`}
      title="Toggle exercise done"
    >
      {isCompleted ? <ClearIcon sx={{ fontSize: 28 }} /> : <CheckIcon sx={{ fontSize: 28 }} />}
    </button>
  );
}