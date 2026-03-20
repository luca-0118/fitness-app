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
                        className="rounded-full p-5 w-[90%] mx-auto bg-[#F67631] hover:bg-[#FF9962] active:bg-[#FF9962]"
                        >
                        Start Session
                    </button>
            </div>
        </>
    )
}