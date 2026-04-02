import CheckIcon from '@mui/icons-material/Check';

interface CheckmarkProps {
    onClick?: () => void;
    className?: string;
    iconSize?: number;
    isActive?: boolean;
}

export default function Checkmark({ onClick, className, iconSize = 32, isActive = false }: CheckmarkProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={className || "cursor-pointer rounded-full border-2 border-[#0ceb31] bg-[#0ceb31] text-white hover:bg-[#0ceb31] hover:text-white active:bg-[#0ceb31] active:text-white flex items-center justify-center transition-colors"}
        >
            <CheckIcon sx={{ fontSize: iconSize }} />
        </button>
    );
}