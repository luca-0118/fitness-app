import WorkoutWidget from "../components/WorkoutWidget";
import GreenAddButton from "../components/GreenAddButton.tsx";
import { useState, useEffect } from "react";
import API from "../classes/api.ts";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

// I quite genuinely have to remap my UUID to id because of muks lib. I hate libs.
type fuckMuksLib = {
    id: string;
    name: string;
    desc?: string;
};

export default function WorkoutOverview() {
    const [workouts, setWorkouts] = useState<fuckMuksLib[]>([]);
    useEffect(() => {
        const getWorkouts = async () => {
            //beautifully wrapped API call.
            const workoutList = await API.workouts.list();
            // I have to remap the response because muks lib requires an ID
            const remappedWorkout: fuckMuksLib[] = workoutList.map((workout) => {
                return {
                    id: workout.uuid,
                    name: workout.name,
                    desc: workout.desc,
                };
            });
            // only set if there's an actual workout saved. Allows for fake data.
            if (remappedWorkout.length >= 1) {
                setWorkouts(remappedWorkout);
            }
        };
        // just calls this above ^
        getWorkouts();
    }, []);

    if (!workouts) return <h1>Loading....</h1>;

    // if the list is still empty, return a incentive to create an workout.
    if (Object.keys(workouts).length < 1)
        return (
            <div>
                <ul className="pt-2 text-center text-gray-400">
                    <li>No workouts yet. Create a new one!</li>
                </ul>
                <GreenAddButton to="/new-workout" />
            </div>
        );

    return (
        <>
            <div>
                <DragDropProvider
                    onDragEnd={(event) => {
                        // #TODO add local backend ordering.
                        setWorkouts((work) => move(work, event));
                    }}
                >
                    <ul className="pt-2">
                        {workouts.map((workout, index) => (
                            <WorkoutWidget key={workout.id} id={workout.id} index={index} name={workout.name} />
                        ))}
                    </ul>
                </DragDropProvider>
                <GreenAddButton to="/new-workout" />
            </div>
        </>
    );
}
