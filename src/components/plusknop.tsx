import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

interface PlusknopProps {
    to?: string;
    onClick?: () => void;
    className?: string;
    iconSize?: number;
}

export default function Plusknop ({ to = "/add-exercises", onClick, className, iconSize = 49 }: PlusknopProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
            return;
        }
        navigate(to);
    };

    return (
        <button
            onClick={handleClick}
            className={className || "cursor-pointer fixed bottom-30 right-6 h-16 w-87 rounded-full bg-[#2e2e2e] hover:bg-[#3a3a3a] flex items-center justify-center z-50"}
        >
            <AddIcon sx={{ fontSize: iconSize }} />
        </button>
    );
}