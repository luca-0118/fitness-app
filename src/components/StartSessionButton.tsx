import { useNavigate } from "react-router-dom";
import API from "../classes/api";

interface StartSessionButtonProps {
    exercises?: ExerciseDTO[];
}

export default function StartSessionButton({ exercises }: StartSessionButtonProps) {
    const navigate = useNavigate();
    const handleStart = () => {
        API.session.start().then ((resp) => {
            if (resp) navigate("/session", { state: { exercises } });
        })
    };
    return (
        <>
            <div className="flex font-bold">
                    <button
                        onClick={handleStart}
                        className="bg-[#1E1E1E] border-[#414141] border rounded-xl p-5 w-[90%] mx-auto hover:bg-[#252525]"
                        >
                        Start Session
                    </button>
            </div>
        </>
    )
}