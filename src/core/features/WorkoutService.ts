import WorkoutApi from "../api/WorkoutApi";
import Exercise from "../entities/exercise/Exercise.ts";
import Workout from "../entities/workout/Workout.ts";



/**
 * |------------------------------------------------------------|
 * | Contains all functionality regarding workouts.             |
 * | Includes mapping to entities and using api wrappers.       |
 * |------------------------------------------------------------|
 */

/**
 *
 */
export default class WorkoutService {

    /**
     * Gets all workouts made by the user.
     * @returns A workout Object without exercises
     */
    static async getWorkouts() : Promise<Workout[]>
    {
        // gets the list of workouts made by the user from the backend.
        const workouts = await WorkoutApi.list();

        // transforms all the workoutDTO's into Workout objects.
        return workouts.map(workout =>
            Workout.fromDto(workout));
    } 

    /**
     * Gets a workout with exercises.
     * @param workoutId The uuid of an workout
     * @returns Workout object
     */
    static async getDetailedWorkout(workoutId: string): Promise<Workout>
    {
        // Grabs the response from the api call.
        const workoutDTO = await WorkoutApi.single(workoutId);

        //Checks if it's found, otherwise throw an error.
        if (!workoutDTO) throw new Error("workout not found");

        // map all the exercises in the response to an exercise object.
        const exercises = workoutDTO.exercises.map(exercise => Exercise.fromDto(exercise));

        // return a Workout object with the exercises.
        return new Workout(workoutDTO.uuid,workoutDTO.name,{exercises});
    } 
}