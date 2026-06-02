import { useNavigate } from "react-router-dom";
import { useWorkout } from "../../../context/WorkoutContext.tsx";

export default function GreenAddButton({ to = "/new-workout" }) {
  const { setWorkoutName, clearWorkout } = useWorkout();
  const navigate = useNavigate();

  function handleClick(to: string) {
    setWorkoutName("");
    clearWorkout();
    navigate(to);
  }

  return (
    <button
      onClick={() => handleClick(to)}
      className="cursor-pointer mx-auto sticky bottom-2 h-16 justify-center items-center font-bold w-[90%] rounded-full bg-accent hover:bg-accent-action active:bg-accent-action flex z-30 text-textcolor"
    >
      New Workout
    </button>
  );
}
