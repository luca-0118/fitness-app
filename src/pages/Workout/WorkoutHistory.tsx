import WorkoutHistoryWidget from "../../components/Workout/listItems/WorkoutHistoryWidget.tsx";
import { useEffect, useState } from "react";
import API from "../../classes/api.ts";
import WorkoutHistorySkeleton from "../../components/skeletons/workoutHistorySkeleton.tsx";

export default function WorkoutHistory() {
    const [history, setHisory] = useState<IworkoutHistory[]>([]);

    useEffect(() => {
        const get = async () => {
            const resp = await API.workouts.history();
            if (resp.length == 0) return;

            setTimeout(() => {
                setHisory(resp);
            }, 3000);
        }

        get();

    }, []);

    if (history.length == 0) return <div><div className="p-2 flex flex-col gap-4 mb-20"><WorkoutHistorySkeleton /><WorkoutHistorySkeleton /><WorkoutHistorySkeleton /></div></div>

    return (
        <>
            <div>
                <div className="pt-2 mb-20">
                    {history.map((workout, idx) => (
                        <WorkoutHistoryWidget key={idx} workout={workout} />
                    ))}

                </div>
            </div>
        </>
    );
}
