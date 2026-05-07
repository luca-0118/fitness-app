import {useQuery} from "@tanstack/react-query";
import HistoryService from "../../core/features/HistoryService.ts";
import WorkoutSession from "../../core/entities/workout/WorkoutSession.ts";


/**
 * returns the history of completed workouts.
 */
export default function useWorkoutHistory() {
    return useQuery<WorkoutSession[]>({
        queryKey:["workout","history"],
        queryFn: HistoryService.list
    });
}