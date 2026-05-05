import {useQuery} from "@tanstack/react-query";
import API from "../classes/api.ts";
import {IdetailedWorkoutHistory} from "../types/types.ts";

export default function useCompletedWorkout(id:string) {
    return useQuery<IdetailedWorkoutHistory>({
        queryKey: ["workout","completed",id],
        queryFn: async () => await API.workouts.historyDetails(id)
        });
}