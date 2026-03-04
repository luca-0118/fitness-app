import { useState } from "react";
import ExerciseOverviewWidget from "../components/ExerciseOverviewWidget.tsx";
import Header from "../components/Header.tsx";
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';

export default function Exercises() { /* muk data, moet uiteindelijk een GET API worden*/
    const [exercises, setExercises] = useState([
        { id: 1, name: "Leg Extension" },
        { id: 2, name: "Barbell press" },
        { id: 3, name: "Deadlift" },
        { id: 4, name: "Rows" },
        { id: 5, name: "Lat Pulldowns" },
    ]);

    return (
        <div>
            <Header/>
            <DragDropProvider onDragEnd={(event) => { setExercises((exercises) => move(exercises, event)); }}>
                <ul className="pb-24 pt-2">
                    {exercises.map((exercise, index) => (
                        <ExerciseOverviewWidget key={exercise.id} id={exercise.id} index={index} name={exercise.name} />
                    ))}
                </ul>
            </DragDropProvider>
        </div>
    );
}