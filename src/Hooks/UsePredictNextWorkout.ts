import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react"

interface GraphResponse {
    ok: boolean,
    data: number[]
}

export default function usePredictNextWorkout(exercise_id: string): number[] {
    const [datapoints,setDataPoints] = useState<number[]>([]);

    const getDataPoints = async () => {
        const response = await invoke<GraphResponse>("create_predictive_graph",{exerciseId: exercise_id});

        if (response.ok) {
            setDataPoints(response.data);
        }

    }

    useEffect(() => {
        getDataPoints();
    },[exercise_id]);

    return datapoints;

}