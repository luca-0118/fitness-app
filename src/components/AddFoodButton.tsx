import { useNavigate } from "react-router-dom";

export default function AddFoodButton({ to = "/add-food" }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(to)}
            className="fixed bottom-30 left-0 right-0 flex justify-center z-20 cursor-pointer mx-auto h-16 items-center font-bold w-[90%] rounded-full bg-[#F67631] hover:bg-[#FF9962] active:bg-[#FF9962]"
        >
            Add food
        </button>
    );
}

