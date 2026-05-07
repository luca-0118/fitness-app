import { useQuery } from "@tanstack/react-query";
import {WorkoutDTO} from "../../types/types.ts";
import WorkoutService from "../../core/features/WorkoutService.ts";

/**
 * Returns list of workouts that have been created/added by the user.
 */
export default function useWorkouts() {
    return useQuery<WorkoutDTO[]>({
        queryKey: ["workouts"], 
        queryFn: WorkoutService.getWorkouts 
    });
}