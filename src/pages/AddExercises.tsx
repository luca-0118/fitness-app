import ExerciseWidget from "../components/ExerciseWidget";
import { useEffect, useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { useNavigate } from "react-router-dom";
import API from "../classes/api";

export default function AddExercises() {
    const [allExercises, setAllExercise] = useState<ExerciseDTO[]>([]);
    const { addExercise } = useWorkout();
    const navigate = useNavigate();

    async function fetchExercises() {
        const result = await API.exercises.list();
        setAllExercise(result);
    }

    useEffect(() => {
        fetchExercises();
    }, []);

    return (
        <>
            <div>
                {allExercises.map((exercise) => {
                    return (
                        <ExerciseWidget
                            key={exercise.id}
                            name={exercise.name}
                            gif={exercise.data}
                            onSelect={() => {
                                addExercise({ id: exercise.id, name: exercise.name });
                                navigate(-1);
                            }}
                        />
                    );
                })}
            </div>
        </>
    );
}
