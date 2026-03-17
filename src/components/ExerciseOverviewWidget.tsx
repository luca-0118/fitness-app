import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSortable } from "@dnd-kit/react/sortable";

interface ExerciseOverviewWidgetProps {
  id: string;
  index: number;
  name: string;
  gif: string;
}

export default function ExerciseOverviewWidget({
  id,
  index,
  name,
  gif,
}: ExerciseOverviewWidgetProps) {
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
      <button
        className="flex w-full h-full py-4"
        onClick={() => navigate("/exercise-description")}
      >
        <img
          className="h-20 w-20 contain-content rounded-xl"
          src={gif}
          alt=""
        />
        <h2 className="text-lg ml-5 font-semibold">{name}</h2>
      </button>
    </li>
  );
}
