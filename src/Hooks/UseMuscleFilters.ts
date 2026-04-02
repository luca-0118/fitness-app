import {useEffect, useState} from "react";
import API from "../classes/api.ts";


interface ReturnProps{
    sortedExercises: ExerciseDTO[]
    setMuscle: (muscle:muscleGroups) => void
    muscleGroup: muscleGroups
}

// interface UseMuscleFilterProps {
// }

export type muscleGroups = "pectorals"|
    "biceps"|
    "triceps"|
    "lats"|
    "upper back"|
    "delts"|
    "forearms"|
    "abs"|
    "quads"|
    "hamstrings"|
    "glutes"|
    "calves"|
    null;

/**
 * Encapsulated version of Lars's filter function.
 * @constructor
 * @returns sortedExercises -- A list of exercises sorted according to the filter
 * @returns muscleGroup -- the currently selected muscle group, is required in order to highlight selected.
 * @returns setMuscle -- a function to change the currently selected muscle. Passing the same muscle twice unsets it.
 */
export default function UseMuscleFilters(): ReturnProps {
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
        API.exercises.list().then(setExercises);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!muscleGroup) {
                const data = await API.exercises.list();
                setExercises(data);
            } else {
                const data = await API.exercises.filter(muscleGroup);
                setExercises(data);
            }
        };
        fetchData();
    }, [muscleGroup]);

    return {sortedExercises: exercises, muscleGroup,setMuscle}
}