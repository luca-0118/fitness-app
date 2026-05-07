import { useQuery } from "@tanstack/react-query";
import WorkoutService from "../../core/features/WorkoutService.ts";
import Workout from "../../core/entities/workout/Workout.ts";

export default function useDetailedWorkout(workoutId: string) {
    return useQuery<Workout>({
        queryKey:["workout","detailed",workoutId],
        queryFn: async () => WorkoutService.getDetailedWorkout(workoutId)
    })
}