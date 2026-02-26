import { useNavigate } from "react-router-dom";

interface ExerciseOverviewWidgetProps {
    name: string;
}

export default function ExerciseOverviewWidget({ name }: ExerciseOverviewWidgetProps) {
    const navigate = useNavigate();

    return (
        <div className="bg-[#1E1E1E] border-[#414141] border rounded-xl py-4 px-6 mb-3 flex w-full hover:bg-[#252525] mt-2">
            <button className="flex w-full" onClick={() => navigate("/exercise-description")}>
                <h2 className="text-lg font-semibold">{name}</h2>
            </button>
        </div>
    );
}
