import {useNavigate} from "react-router-dom";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface WorkoutWidgetProps {
    name: string;
}

export default function WorkoutWidget({ name }: WorkoutWidgetProps) {
    const navigate = useNavigate();
    return (
        <button className="bg-[#1E1E1E] border-[#414141] border rounded-xl py-4 px-6 mb-3 flex w-full hover:bg-[#252525]" onClick={() => navigate("/exercises")}>
            <DragIndicatorIcon sx={{ fontSize: 40, color: "#F67631"}}/>
            <h2 className="text-lg font-semibold">{name}</h2>
        </button>
    );
}