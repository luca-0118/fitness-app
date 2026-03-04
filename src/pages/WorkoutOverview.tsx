import WorkoutWidget from "../components/WorkoutWidget";
import GreenAddButton from "../components/GreenAddButton.tsx";
import { useState, useEffect } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { ApiClient } from "../classes/api.ts";

interface Workout {
    uuid: string;
    name: string;
    desc?: string;
}

export default function WorkoutOverview() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const result = await ApiClient.send<Workout[]>("list_workouts");
                const data = ApiClient.assertOk(result);
                setWorkouts(data);
                console.log("Fetched workouts:", data);
            } catch (error) {
                console.error("Failed to fetch workouts:", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchWorkouts();
    }, []);

    if (loading) return <h2 className="[24px] font-bold text-[#F2F3F2] text-center pt-8 h-screen w-screen">Loading workouts...</h2>;

    return (
        <div>
            <DndContext
                onDragEnd={(event: DragEndEvent) => {
                    const { active, over } = event;

                    if (over && active.id !== over.id) {
                        setWorkouts((items) => {
                            const oldIndex = items.findIndex(i => i.uuid === active.id);
                            const newIndex = items.findIndex(i => i.uuid === over.id);
                            return arrayMove(items, oldIndex, newIndex);
                        });
                    }
                }}
            >
                <ul className="pt-2">
                    {workouts.map((workout, index) => (
                        <WorkoutWidget
                            key={workout.uuid}
                            id={workout.uuid}
                            index={index}
                            name={workout.name}
                        />
                    ))}
                </ul>
            </DndContext>

            <GreenAddButton to="/new-workout" />
        </div>
    );
}