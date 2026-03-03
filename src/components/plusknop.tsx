import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

export default function Plusknop ({ to = "/add-exercises" }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(to)}
            className="cursor-pointer fixed bottom-30 right-6 h-16 w-87 rounded-full bg-[#2e2e2e] hover:bg-[#3a3a3a] flex items-center justify-center z-50"
        >
            <AddIcon sx={{ fontSize: 49 }} />
        </button>
    );
}