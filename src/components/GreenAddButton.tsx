import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

export default function GreenAddButton() {
    const navigate = useNavigate();

    return (
    <button onClick={() => navigate("/new-workout")}
            className="fixed bottom-30 right-6 h-16 w-16 rounded-full bg-[#40C057] hover:bg-[#5AEA74] flex items-center justify-center z-50">
            <AddIcon sx={{ fontSize: 49 }}/>
    </button>
    )
}