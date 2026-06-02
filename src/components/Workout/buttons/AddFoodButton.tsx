import { useNavigate } from "react-router-dom";

export default function AddFoodButton({ to = "/food-list" }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(to)}
            className="flex justify-center z-20 cursor-pointer mx-auto h-16 items-center font-bold w-full rounded-full bg-accent hover:bg-accent-action active:bg-accent-action text-textcolor"
        >
            Add food
        </button>
    );
}

