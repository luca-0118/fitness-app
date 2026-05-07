import { useQuery } from "@tanstack/react-query";
import {WorkoutDTO} from "../../types/types.ts";
import WorkoutService from "../../core/features/WorkoutService.ts";

export default function useWorkouts() {
    return useQuery<WorkoutDTO[]>({
        queryKey: ["workouts"], 
        queryFn: WorkoutService.getWorkouts 
    });
}