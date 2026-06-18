import { useWorkout } from "../../context/WorkoutContext.tsx";
import AddExerciseButton from "../../components/Workout/buttons/AddExerciseButton.tsx";
import ExerciseOverviewWidget from "../../components/Workout/listItems/ExerciseOverviewWidget.tsx";

export default function NewWorkout() {
  const { workoutName, setWorkoutName, exercises } = useWorkout();

  return (
    <div
      className="
    fixed inset-0 
    top-15
    bottom-15
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
        className="border p-2 rounded text-textcolor bg-components border-accent w-[90%] mx-auto flex mt-5"
      />
      <div className="mt-4">
        <h2 className="font-bold text-textcolor text-center justify-center mb-2 border-b-2 border-bordercolor w-[90%] flex mx-auto">
          Selected Exercises:
        </h2>
        <ul className="text-center">
          {exercises.map((exercise,idx) => {
            return (
              <ExerciseOverviewWidget
                id={exercise.id}
                key={exercise.id}
                name={exercise.name}
                gif={exercise.gif}
                index={idx}
                exerciseId={exercise.id}
                setCount={exercise.sets}
              />
            );
          })}
        </ul>
        <AddExerciseButton to="/add-exercises" />
      </div>
    </div>
  );
}
