import ExerciseWidget from "../components/ExerciseWidget";
import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import { useWorkout } from "../context/WorkoutContext";
import {useNavigate} from "react-router-dom";
import API from "../classes/api";



export default function AddExercises() {
    const [allExercises, setAllExercise] = useState<Exercise[]>([]);
    const { addExercise } = useWorkout();
    const navigate = useNavigate();

    async function fetchExercises() {
        const result = await invoke<ApiSucess<Exercise[]>>('get_all_exercises');
        setAllExercise(result.data);
    }

    useEffect(() => {
        fetchExercises();
    }, []);

    return (
        <>
            <div>
                {allExercises.map((exercise) => {
                    return <ExerciseWidget 
                        key={exercise.id} 
                        name={exercise.name}
                        gif={exercise.data}
                        onSelect={() => {
                            addExercise(exercise.name);
                            navigate(-1);
                        }}
                    />
                })}
            </div>
        </>
    );
}