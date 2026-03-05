// src/context/WorkoutContext.tsx
import { createContext, useContext, useState, ReactNode, SetStateAction } from "react";

interface WorkoutContextProps {
    workoutName: string;
    setWorkoutName: (name: string) => void;
    exercises: Iworkout[];
    addExercise: (workout: Iworkout) => void;
    removeExercise: (workout: Iworkout) => void;
    clearWorkout: () => void;
    selectedWorkout: string;
    setSelectedWorkout: (value: SetStateAction<string>) => void;
}

const WorkoutContext = createContext<WorkoutContextProps | undefined>(undefined);

export type Iworkout = {
    id: string;
    name: string;
};

export function WorkoutProvider({ children }: { children: ReactNode }) {
    const [workoutName, setWorkoutName] = useState("");
    const [exercises, setExercises] = useState<Iworkout[]>([]);
    const [selectedWorkout, setSelectedWorkout] = useState<string>("");

    const addExercise = (workout: Iworkout) => {
        if (!exercises.includes(workout)) setExercises([...exercises, workout]);
    };

    const removeExercise = (workout: Iworkout) => {
        setExercises(exercises.filter((ex) => ex !== workout));
    };

    const clearWorkout = () => {
        setWorkoutName("");
        setExercises([]);
    };

    return (
        <WorkoutContext.Provider
            value={{
                workoutName,
                setWorkoutName,
                exercises,
                addExercise,
                removeExercise,
                clearWorkout,
                selectedWorkout,
                setSelectedWorkout,
            }}
        >
            {children}
        </WorkoutContext.Provider>
    );
}

export function useWorkout(): WorkoutContextProps {
    const context = useContext(WorkoutContext);
    if (!context) throw new Error("useWorkout must be used within WorkoutProvider");
    console.log(context);
    return context;
}
