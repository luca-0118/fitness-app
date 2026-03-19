import { useNavigate } from "react-router-dom";

export default function GreenAddButton({ to = "/new-workout" }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(to)}
            className="cursor-pointer mx-auto sticky bottom-2 h-16 justify-center items-center font-bold w-[90%] rounded-full bg-[#F67631] hover:bg-[#FF9962] active:bg-[#FF9962] flex z-50"
        >
            New Workout
        </button>
    );
}