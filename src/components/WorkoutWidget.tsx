import {useNavigate} from "react-router-dom";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface WorkoutWidgetProps {
    name: string;
}

export default function WorkoutWidget({ name }: WorkoutWidgetProps) {
    const navigate = useNavigate();
    return (
        <div className="bg-[#1E1E1E] border-[#414141] border rounded-xl py-4 px-6 mb-3 flex w-[90%] items-center mx-auto hover:bg-[#252525] cursor-pointer">
            <button className="cursor-pointer">
                <DragIndicatorIcon sx={{ fontSize: 40, color: "#F67631"}}/>
            </button>

            <button className="flex-1 text-left cursor-pointer" onClick={() => navigate("/exercises")}>
                <h2 className="text-lg font-semibold">{name}</h2>
            </button>

            <button className="ml-auto cursor-pointer" onClick={() => navigate("/edit-workout")}>
                <MoreVertIcon sx={{ fontSize: 40 }} />
            </button>
        </div>
    );
}