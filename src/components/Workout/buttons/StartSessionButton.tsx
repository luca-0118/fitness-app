import { useNavigate } from "react-router-dom";
import API from "../../../classes/api.ts";

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
            <div className="flex">
                    <button
                        onClick={handleStart}
                        className="text-textcolor font-bold rounded-full p-5 w-[90%] mx-auto bg-accent hover:bg-accent-action active:bg-accent-action"
                        >
                        Start Session
                    </button>
            </div>
        </>
    )
}