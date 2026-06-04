import { useNavigate } from "react-router-dom";

export default function AddExerciseButton ({ to = "/new-workout" }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(to)}
            className="text-textcolor cursor-pointer mx-auto sticky bottom-2 h-16 justify-center items-center font-bold w-[90%] rounded-full bg-accent hover:accent active:accent flex z-30"
        >
            Add Exercise
        </button>
    );
}