import {useEffect, useState} from "react";
import API from "../classes/api.ts";


interface ReturnProps{
    sortedExercises: ExerciseDTO[]
    setMuscle: (muscle:muscleGroups) => void
    muscleGroup: muscleGroups
}

/**
 * Encapsulated version of Lars's filter function.
 *
 * DIP: The concrete exercises API is provided via the exercisesApi parameter
 * so that consumers are not coupled to the global API singleton.  The default
 * value falls back to API.exercises for convenience in production code.
 *
 * @constructor
 * @param exercisesApi - injectable exercises API (defaults to API.exercises)
 * @returns sortedExercises -- A list of exercises sorted according to the filter
 * @returns muscleGroup -- the currently selected muscle group, is required in order to highlight selected.
 * @returns setMuscle -- a function to change the currently selected muscle. Passing the same muscle twice unsets it.
 */
export default function UseMuscleFilters(exercisesApi: IExercisesAPI = API.exercises): ReturnProps {
    const [muscleGroup,setMuscleGroup] = useState<muscleGroups>(null);
    const [exercises,setExercises] = useState<ExerciseDTO[]>([]);

    // The default function to update muscles.
    const setMuscle = (muscle: muscleGroups) => {
        if (muscleGroup === muscle) {
            setMuscleGroup(null);
        } else setMuscleGroup(muscle);
    }

    // Fetch exercises once
    useEffect(() => {
        exercisesApi.list().then(setExercises);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!muscleGroup) {
                const data = await exercisesApi.list();
                setExercises(data);
            } else {
                const data = await exercisesApi.filter(muscleGroup);
                setExercises(data);
            }
        };
        fetchData();
    }, [muscleGroup]);

    return {sortedExercises: exercises, muscleGroup,setMuscle}
}