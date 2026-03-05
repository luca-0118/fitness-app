import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

interface ExerciseWidgetProps {
    name: string;
    gif: string;
    onSelect?: () => void;
}

export default function ExerciseWidget({ name, gif, onSelect }: ExerciseWidgetProps) {
    const navigate = useNavigate();
    return (
        <div className="bg-[#1E1E1E] border-[#414141] border rounded-xl px-2 mb-3 flex w-[90%] items-center mx-auto hover:bg-[#252525] cursor-pointer mt-2">
            <button className="flex w-full h-full py-4" onClick={() => navigate("/exercise-description")}>
                <img className="rounded-xl w-20 h-20 mr-4" alt={ name } src={ gif } loading="lazy"/>
                <h2 className="text-lg font-semibold">{name}</h2>
            </button>
            <button onClick={onSelect} className="flex h-12 w-12 rounded-full bg-[#40C057] hover:bg-[#5AEA74] ml-2 z-50">
                <AddIcon sx={{ fontSize: 49 }} />
            </button>
        </div>  
    );
}