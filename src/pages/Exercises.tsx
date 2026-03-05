import { useEffect, useState } from "react";
import ExerciseOverviewWidget from "../components/ExerciseOverviewWidget.tsx";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import StartSessionButton from "../components/StartSessionButton.tsx";
import API from "../classes/api.ts";
import { useWorkout } from "../context/WorkoutContext.tsx";

export default function Exercises() {
    /* muk data, moet uiteindelijk een GET API worden*/
    const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
    const { selectedWorkout } = useWorkout();

    useEffect(() => {
        const getData = async () => {
            const hi = await API.workouts.detailed(selectedWorkout);
            if (typeof hi === "string") {
                return;
            }

            setExercises(hi.exercises);
        };
        getData();
    }, []);

    // const [exercises, setExercises] = useState([
    //     { id: 1, name: "Leg Extension" },
    //     { id: 2, name: "Barbell press" },
    //     { id: 3, name: "Deadlift" },
    //     { id: 4, name: "Rows" },
    //     { id: 5, name: "Lat Pulldowns" },
    //     { id: 6, name: "Leg Press" },
    //     { id: 7, name: "Lunges" },
    //     { id: 8, name: "Hip Thrusts" },
    //     { id: 9, name: "Bicep Curls" },
    //     { id: 10, name: "Pullups" },
    // ]);

    return (
        <>
            <div className="pb-18 pt-2">
                <DragDropProvider
                    onDragEnd={(event) => {
                        setExercises((exercises) => move(exercises, event));
                    }}
                >
                    <ul>
                        {exercises.map((exercise, index) => (
                            <ExerciseOverviewWidget
                                key={exercise.id}
                                id={exercise.id}
                                index={index}
                                name={exercise.name}
                            />
                        ))}
                    </ul>
                </DragDropProvider>
                <div className="absolute bottom-0 pb-24 w-full opacity-80">
                    <StartSessionButton />
                </div>
            </div>
        </>
    );
}
