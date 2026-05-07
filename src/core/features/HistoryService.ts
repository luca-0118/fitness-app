import HistoryApi from "../api/HistoryApi";
import WorkoutSession from "../entities/workout/WorkoutSession.ts";


/**
 * |------------------------------------------------------------|
 * | HistoryService should contain all api calls made for       |
 * | gathering history of workouts, foods, etc.                 |
 * | It should also contain any mapping to the entities made for|
 * | the type of historyItem.                                   |
 * |------------------------------------------------------------|
 */

/**
 *
 */
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