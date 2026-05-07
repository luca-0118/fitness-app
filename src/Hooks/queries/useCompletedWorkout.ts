import {useQuery} from "@tanstack/react-query";
import WorkoutSession from "../../core/entities/workout/WorkoutSession.ts";
import HistoryService from "../../core/features/HistoryService.ts";

export default function useCompletedWorkout(id:string) {
    return useQuery<WorkoutSession>({
        queryKey: ["workout","completed",id],
        queryFn: async () => HistoryService.getSingleCompletedWorkout(id)
        });
}