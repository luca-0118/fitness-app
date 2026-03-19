import { useNavigate } from "react-router-dom";
import API from "../classes/api";

interface StartSessionButtonProps {
    exercises?: ExerciseDTO[];
    workoutId: string;
}

export default function StartSessionButton({ exercises, workoutId }: StartSessionButtonProps) {
    const navigate = useNavigate();
    const handleStart = () => {
        API.session.start(workoutId).then ((resp) => {
            if (resp) navigate("/session", { state: { exercises } });
        })
    };
    return (
        <>
            <div className="flex font-bold">
                    <button
                        onClick={handleStart}
                        className="bg-[#40C057] rounded-full p-5 w-[90%] mx-auto hover:bg-[#5AEA74] active:bg-[#5AEA74]"
                        >
                        Start Session
                    </button>
            </div>
        </>
    )
}