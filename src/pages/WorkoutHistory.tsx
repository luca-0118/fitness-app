import WorkoutHistoryWidget from "../components/WorkoutHistoryWidget.tsx";
import {useEffect, useState} from "react";
import API from "../classes/api.ts";

export default function WorkoutHistory() {
    const [history,setHisory] = useState<IworkoutHistory[]>([]);

    useEffect(() => {
        const get = async () => {
            const resp = await API.workouts.history();
            if (resp.length == 0) return;

            setHisory(resp);
        }

        get();

    }, []);

    if (history.length == 0 ) return <h1>Loading...</h1>

    return (
        <>
            <div>
                <div className="pt-2">
                    {history.map((workout,idx) => (
                        <WorkoutHistoryWidget key={idx} workout={workout} />
                    ))}
                </div>
            </div>
        </>
    );
}
