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
            const plotPoints = response.data
                    
            if (plotPoints && plotPoints.find(p => p === null) != 0) {
                console.warn("null value found. Removed it but be careful. This means a workout hasn't been filled properly.");
                return setDataPoints(plotPoints.filter(p => p === null));
            }

            return setDataPoints(response.data);
        }

    }

    useEffect(() => {
        getDataPoints();
    },[exercise_id]);

    return datapoints;

}