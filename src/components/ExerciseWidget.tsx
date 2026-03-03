import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

interface ExerciseWidgetProps {
    name: string;
}

export default function exerciseWidget({ name }: ExerciseWidgetProps) {
    const navigate = useNavigate();

    return (
        <div className="bg-[#1E1E1E] border-[#414141] border rounded-xl px-2 mb-3 flex w-[90%] items-center mx-auto hover:bg-[#252525] cursor-pointer mt-2">
            <button className="flex w-full h-full py-4" onClick={() => navigate("/exercise-description")}>
                <h2 className="text-lg font-semibold">{name}</h2>
            </button>
            <button onClick={() => navigate("/new-workout")} className="flex h-12 w-12 rounded-full bg-[#40C057] hover:bg-[#5AEA74] ml-auto z-50">
                <AddIcon sx={{ fontSize: 49 }} />
            </button>
        </div>
    );
}