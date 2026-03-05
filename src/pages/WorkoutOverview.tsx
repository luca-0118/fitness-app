import WorkoutWidget from "../components/WorkoutWidget";
import GreenAddButton from "../components/GreenAddButton.tsx";
import { useState } from "react";
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';

export default function WorkoutOverview() { /* mock data, moet uiteindelijk een GET API worden*/
    const [workouts, setWorkouts] = useState([
        { id: 1, name: "Push Day" },
        { id: 2, name: "Pull Day" },
        { id: 3, name: "Leg Day" },
        { id: 4, name: "Upper Body" },
        { id: 5, name: "Lower Body" },
        { id: 6, name: "PR day" },
        { id: 7, name: "Full body" },
        { id: 8, name: "Cardio" },
        { id: 9, name: "Recovery" },
        { id: 10, name: "Glute" },
    ]);

    return (
        <>
            <div>
                <DragDropProvider onDragEnd={(event) => { setWorkouts((workouts) => move(workouts, event)); }}>
                    <ul className="pt-2">
                        {workouts.map((workout, index) => (
                            <WorkoutWidget key={workout.id} id={workout.id} index={index} name={workout.name} />
                        ))}
                    </ul>
                </DragDropProvider>
                <GreenAddButton to="/new-workout"/>
            </div>
        </>
    );
}