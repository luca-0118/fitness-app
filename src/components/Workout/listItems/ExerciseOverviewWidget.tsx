import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSortable } from "@dnd-kit/react/sortable";
import SetInput from "../../ui/SetInput";
import { useWorkout } from "../../../context/WorkoutContext";

interface ExerciseOverviewWidgetProps {
  id: string;
  index: number;
  name: string;
  gif: string;
  exerciseId: string;
  setCount:number;
  disabled?: boolean;
}

export default function ExerciseOverviewWidget({
  id,
  index,
  name,
  gif,
  exerciseId,
  setCount,
  disabled
}: ExerciseOverviewWidgetProps) {
  const navigate = useNavigate();
  const [element, setElement] = useState<HTMLElement | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const { isDragging } = useSortable({ id, index, element, handle: handleRef });
  const {updateExercise} = useWorkout();


  const handleSetUpdate = (setCount:number) => {
    console.log("updated!",setCount);
    updateExercise(index,{name,id,gif,sets:setCount});
  }

  return (
    <li
      ref={setElement}
      className={`bg-components border-bordercolor border rounded-xl px-2 mb-3 flex w-[90%] items-center mx-auto hover:bg-components-hover active:bg-components-hover transition-transform duration-100 ease-in-out ${isDragging ? "opacity-80 scale-[1.05]" : ""} `}
      data-shadow={isDragging || undefined}
    >
      <button
        className="flex w-full h-full py-4"
        onClick={() =>
          navigate("/exercise-description", {
            state: { id: exerciseId },
          })
        }
      >
        <img
          className="h-20 w-20 contain-content rounded-xl"
          src={gif}
          alt=""
        />
        <div className="flex flex-col">
        <h2 className="text-lg ml-5 font-semibold text-textcolor">{name}</h2>
        <SetInput onChange={handleSetUpdate} defaultVal={setCount} disabled={disabled}/>
        </div>
      </button>
    </li>
  );
}
