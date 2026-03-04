import { useWorkout } from "../Context/WorkoutContext";
import ExerciseWidget from "../components/ExerciseWidget";
import { useNavigate } from "react-router-dom";

export default function AddExercises() {
    const { addExercise } = useWorkout();
    const navigate = useNavigate();

    const exercises = [
        "Leg Extension",
        "Barbell Press",
        "Deadlift",
        "Rows",
        "Lat Pulldowns",
        "Leg Press",
        "Lunges",
        "Hip Thrusts",
        "Bicep Curls",
        "Pullups",
    ];

    return (
        <div className="p-4 ">
            {exercises.map((exercise) => (
                <ExerciseWidget
                    key={exercise}
                    name={exercise}
                    onSelect={() => {
                        addExercise(exercise);
                        navigate(-1); // go back to previous page
                    }}
                />
            ))}
        </div>
    );
}