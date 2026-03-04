// src/context/WorkoutContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface WorkoutContextProps {
    workoutName: string;
    setWorkoutName: (name: string) => void;
    exercises: string[];
    addExercise: (name: string) => void;
    removeExercise: (name: string) => void;
    clearWorkout: () => void;
}

const WorkoutContext = createContext<WorkoutContextProps | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
    const [workoutName, setWorkoutName] = useState("");
    const [exercises, setExercises] = useState<string[]>([]);

    const addExercise = (name: string) => {
        if (!exercises.includes(name)) setExercises([...exercises, name]);
    };

    const removeExercise = (name: string) => {
        setExercises(exercises.filter((ex) => ex !== name));
    };

    const clearWorkout = () => {
        setWorkoutName("");
        setExercises([]);
    };

    return (
        <WorkoutContext.Provider value={{ workoutName, setWorkoutName, exercises, addExercise, removeExercise, clearWorkout }}>
            {children}
        </WorkoutContext.Provider>
    );
}

export function useWorkout() {
    const context = useContext(WorkoutContext);
    if (!context) throw new Error("useWorkout must be used within WorkoutProvider");
    return context;
}