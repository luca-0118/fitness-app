import ExerciseWidget from "../components/ExerciseWidget";
import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'



export default function AddExercises() {
    const [allExercises, setAllExercise] = useState([])

    async function fetchExercises() {
        const result = await invoke('get_all_exercises');
        setAllExercise(result.data);
        console.log(result.data);
    }

    useEffect(() => {
        fetchExercises();
    }, []);

    return (
        <>
            <div>
                {allExercises.map((exercise) => {
                    return <ExerciseWidget  key={exercise.id} name={exercise.name} gif={exercise.data}/>
                })}
            </div>
        </>
    );
}