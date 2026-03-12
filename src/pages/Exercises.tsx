import { useEffect, useState } from "react";
import ExerciseOverviewWidget from "../components/ExerciseOverviewWidget.tsx";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import StartSessionButton from "../components/StartSessionButton.tsx";
import API from "../classes/api.ts";
import { useWorkout } from "../context/WorkoutContext.tsx";
import {PointerSensor, PointerActivationConstraints, DragDropManager} from '@dnd-kit/dom';
const manager = new DragDropManager({
    sensors: [
        PointerSensor.configure({
            activationConstraints: [
                new PointerActivationConstraints.Delay({
                    value: 150,
                    tolerance: {x: 5, y: 5},
                }),
            ]
        })
    ]
});
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
            setExercises(
            hi.exercises.map((exercise: ExerciseDTO, index: number) => ({
                ...exercise,
                instanceId: index
            })));
        };
        getData();
    }, []);

    return (
        <>
            <div className="pb-18 pt-2">
                <DragDropProvider manager={manager}
                    onDragEnd={(event) => {
                        setExercises((exercises) => move(exercises, event));
                    }}
                >
                    <ul>
                        {exercises.map((exercise, index) => (
                            <ExerciseOverviewWidget
                                key={exercise.instanceId}
                                id={exercise.instanceId.toString()}
                                index={index}
                                name={exercise.name}
                            />
                        ))}
                    </ul>
                </DragDropProvider>
                <div className="absolute bottom-0 pb-24 w-full opacity-80">
                    <StartSessionButton exercises={exercises} />
                </div>
            </div>
        </>
    );
}
