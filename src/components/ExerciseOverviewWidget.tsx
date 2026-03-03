import { useNavigate } from "react-router-dom";

interface ExerciseOverviewWidgetProps {
    name: string;
}

export default function ExerciseOverviewWidget({ name }: ExerciseOverviewWidgetProps) {
    const navigate = useNavigate();

    return (
        <div className="bg-[#1E1E1E] border-[#414141] border rounded-xl  px-2 mb-3 flex w-[90%] items-center mx-auto hover:bg-[#252525] cursor-pointer mt-2">
            <button className="flex w-full h-full py-4" onClick={() => navigate("/exercise-description")}>
                <h2 className="text-lg font-semibold">{name}</h2>
            </button>
        </div>
    );
}
