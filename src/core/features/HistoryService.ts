import HistoryApi from "../api/HistoryApi";
import WorkoutSession from "../entities/workout/WorkoutSession.ts";

export default class HistoryService {
    
    static async list(): Promise<WorkoutSession[]>
    {
        const history = await HistoryApi.getWorkoutHistory();

        return history.map(h => WorkoutSession.fromDto(h));
    }

    static async getSingleCompletedWorkout(workoutId: string)
    {
        const completedWorkout = await HistoryApi.getOneWorkout(workoutId);

        return WorkoutSession.fromDto(completedWorkout);
    }
}