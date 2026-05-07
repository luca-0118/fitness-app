import { useQuery } from "@tanstack/react-query";
import WorkoutService from "../../core/features/WorkoutService.ts";
import Workout from "../../core/entities/workout/Workout.ts";


/**
 * returns details of a specific workout based ont the given workoutId.
 * @param workoutId a UUID v7 string that is the workoutId.
 */
export default function useDetailedWorkout(workoutId: string) {
    return useQuery<Workout>({
        queryKey:["workout","detailed",workoutId],
        queryFn: async () => WorkoutService.getDetailedWorkout(workoutId)
    })
}