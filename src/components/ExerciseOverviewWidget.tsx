import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useSortable } from "@dnd-kit/react/sortable";

interface ExerciseOverviewWidgetProps {
    id: string;
    index: number;
    name: string;
}

export default function ExerciseOverviewWidget({ id, index, name }: ExerciseOverviewWidgetProps) {
    const navigate = useNavigate();
    const [element, setElement] = useState<HTMLElement | null>(null);
    const handleRef = useRef<HTMLButtonElement | null>(null);
    const { isDragging } = useSortable({ id, index, element, handle: handleRef });

    return (
        <li
            ref={setElement}
            className={`bg-[#1E1E1E] border-[#414141] border rounded-xl px-2 mb-3 flex w-[90%] items-center mx-auto hover:bg-[#252525] transition-transform duration-100 ease-in-out ${isDragging ? "opacity-80 scale-[1.05]" : ""} `}
            data-shadow={isDragging || undefined}
        >
            <button ref={handleRef} className="cursor-grab">
                <DragIndicatorIcon sx={{ fontSize: 40, color: "#F67631" }} />
            </button>
            <button className="flex w-full h-full py-4" onClick={() => navigate("/exercise-description")}>
                <h2 className="text-lg font-semibold">{name}</h2>
            </button>
        </li>
    );
}
