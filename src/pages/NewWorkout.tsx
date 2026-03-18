import { useWorkout } from "../context/WorkoutContext";
import AddExerciseButton from "../components/AddExerciseButton.tsx";

export default function NewWorkout() {
    const { workoutName, setWorkoutName, exercises } = useWorkout();

    return (
        <div className="my-4 w-full">
            <input
                type="text"
                placeholder="Workout Name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="border p-2 rounded bg-[#1E1E1E] border-[#414141] w-[90%] mx-auto flex"
            />
            <div className="mt-4">
                <h2 className="font-bold text-[#F2F3F2] text-center justify-center mb-2 border-b-2 border-[#414141] w-[90%] flex mx-auto">Selected Exercises:</h2>
                <ul className="text-center">
                    {exercises.map((ex) => (
                        <li
                            className="border p-4 my-2 bg-[#1E1E1E] border-[#414141] rounded-xl hover:bg-[#252525] active:bg-[#252525] font-bold"
                            key={ex.name}
                        >
                            {ex.name}
                        </li>
                    ))}
                </ul>
                <AddExerciseButton to="/add-exercises" />
            </div>
        </div>
    );
}
