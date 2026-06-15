import React, { createContext, useContext, useState } from "react"
import API from "../classes/api";
import useUpdateWorkout from "../Hooks/useUpdateWorkout";

interface EditWorkoutProps {
    workout: IdetailedWorkoutDTO | null;
    initializeDraft: (workoutId: string) => void;
    updateName: (name: string) => void;
    updateExercises: (exerciselist: ExerciseDTO[]) => void;
    saveChanges: () => Promise<boolean>;
};

// the actual context which we are using
const EditWorkoutContext = createContext<EditWorkoutProps | undefined>(undefined);


/**
 * Sets up all the required context actions and states that can then be used
 * Within the context provider.
 * @param param0 The components inside the context to be used.
 * @returns the required wrapper in which the context is availble
 */
export default function EditWorkoutProvider({ children }: { children: React.ReactNode }) {
    const [workout, setWorkout] = useState<IdetailedWorkoutDTO | null>(null);
    const workoutUpdateFunc = useUpdateWorkout();


    /**
     * Gets the workout associated with the workoutId and saved it into the draft.
     * @param workoutId the id of a already existing workout
     * @returns sets the inner draft into the obtained workout
     */
    const initializeDraft = async (workoutId: string) => {
        if (workout) return console.warn("[WARN] current workout is already set.");

        const resp = await API.workouts.detailed(workoutId);

        if (typeof resp == 'string') {
            console.error("error while getting detailed workout:", resp);
            return;
        }

        setWorkout(resp);
        return;
    }

    const updateName = (name: string) => {
        setWorkout(prev => prev ? { ...prev, name } : prev);
    }

    const updateExercises = (exercises: ExerciseDTO[]) => {
        console.log("Current exercise list: ", workout?.exercises);
        console.log("New exercise list ", exercises);
        setWorkout(prev => prev ? { ...prev, exercises } : prev);
    }

    const saveChanges = async () => {
        if (!workout?.name || !workout?.exercises) return false;


        const resp = await workoutUpdateFunc({
            uuid: workout.uuid,
            name: workout?.name,
            desc: workout?.desc,
            exercises: workout?.exercises.map(ex => ex.exercise_id)
        });

        if (!resp) {
            console.error("could not save workout.");
            return false;
        }

        console.debug("[TEMP] saved workout", workout);

        setWorkout(null);
        return true;
    }


    return (<EditWorkoutContext.Provider value={{
        initializeDraft,
        updateName,
        updateExercises,
        saveChanges,
        workout
    }}>
        {children}
    </EditWorkoutContext.Provider>)
}



/**
 * a wrapper function to easily call the edit workout context.
 * @returns the edit workout context
 */
export function useEditWorkout() {
    const context = useContext(EditWorkoutContext);

    if (!context) {
        console.error(
            "useEditWorkout must be used within EditWorkoutProvider"
        );
        return undefined;
    }

    return context;
}