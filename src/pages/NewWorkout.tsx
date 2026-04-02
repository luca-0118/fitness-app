import { useWorkout } from "../context/WorkoutContext";
import AddExerciseButton from "../components/AddExerciseButton.tsx";
import ExerciseOverviewWidget from "../components/ExerciseOverviewWidget.tsx";

export default function NewWorkout() {
  const { workoutName, setWorkoutName, exercises } = useWorkout();

  return (
    <div
      className="
    fixed inset-0 
    top-15
    bottom-15
    bg-[#1E1E1E] 
    overflow-y-auto
    pt-[env(safe-area-inset-top)]
    pb-[env(safe-area-inset-bottom)]
  "
    >
      <input
        type="text"
        placeholder="Workout Name"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
        className="border p-2 rounded bg-[#1E1E1E] border-[#414141] w-[90%] mx-auto flex mt-5"
      />
      <div className="mt-4">
        <h2 className="font-bold text-[#F2F3F2] text-center justify-center mb-2 border-b-2 border-[#414141] w-[90%] flex mx-auto">
          Selected Exercises:
        </h2>
        <ul className="text-center">
          {exercises.map((exercise) => {
            return (
              <ExerciseOverviewWidget
                id={exercise.id}
                key={exercise.id}
                name={exercise.name}
                gif={exercise.gif}
                index={1}
                exerciseId={"test"}
              />
            );
          })}
        </ul>
        <AddExerciseButton to="/add-exercises" />
      </div>
    </div>
  );
}
