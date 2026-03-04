import GreenAddButton from "../components/GreenAddButton.tsx";
import { useWorkout } from "../Context/WorkoutContext";

export default function NewWorkout() {
    const { workoutName, setWorkoutName, exercises } = useWorkout();

    return (
        <div className="p-4">
            <input
                type="text"
                placeholder="Workout Name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="border p-2 rounded w-full bg-[#1E1E1E] border-[#414141]"
            />
            <GreenAddButton to="/add-exercises" />
            <div className="mt-4">
                <h2 className="font-bold text-[#F2F3F2] text-center mb-2 border-b-2">Selected Exercises:</h2>
                <ul className="text-center">
                    {exercises.map((ex) => (
                        <li className="border p-4 my-2 bg-[#1E1E1E] border-[#414141] rounded-xl hover:bg-[#252525] font-bold" key={ex}>{ex}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}