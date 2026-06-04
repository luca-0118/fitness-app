import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

interface PlusknopProps {
    to?: string;
    onClick?: () => void;
    className?: string;
    iconSize?: number;
    disabled?: boolean;
}

export default function Plusknop ({ to = "/add-exercises", onClick, className, iconSize = 49, disabled = false }: PlusknopProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (disabled) return;

        if (onClick) {
            onClick();
            return;
        }
        navigate(to);
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`${className || "cursor-pointer fixed bottom-30 right-6 h-16 w-87 rounded-full bg-components hover:bg-components-hover active:bg-components-hover flex items-center justify-center z-20"} ${disabled ? "opacity-50 cursor-not-allowed hover:bg-components-hover active:bg-components-hover" : ""}`}
        >
            <AddIcon sx={{ fontSize: iconSize }} />
        </button>
    );
}