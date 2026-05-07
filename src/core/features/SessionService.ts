import SessionApi from "../api/SessionApi.ts";
import {SESSION_STORAGE_KEYS} from "../../apis/sessionAPI.ts";
import WorkoutSession from "../entities/workout/WorkoutSession.ts";
import WorkoutApi from "../api/WorkoutApi.ts";
import Workout from "../entities/workout/Workout.ts";
import ExerciseExecution from "../entities/exercise/ExerciseExecution.ts";



/**
 * |------------------------------------------------------------|
 * | Contains all functionality regarding workout sessions.     |
 * | specifically api wrapper calls and mapping to entities     |
 * |------------------------------------------------------------|
 */

/**
 *
 */
export default class SessionService {
    static async startWorkout(workoutId: string)
    {
        const sessionUuid = await SessionApi.startWorkout(workoutId);

        if (!sessionUuid.ok || !sessionUuid.data) return false;

        localStorage.setItem(SESSION_STORAGE_KEYS.id, sessionUuid.data);
        localStorage.setItem(SESSION_STORAGE_KEYS.startedAt, Date.now().toString());
        return localStorage.getItem(SESSION_STORAGE_KEYS.id) !== null;
    }

    static async GetActiveSession()
    {
        const session_id = localStorage.getItem(SESSION_STORAGE_KEYS.id);
        if (!session_id) throw new Error("session not found");

        const session = await SessionApi.getCurrentSession(session_id);
        const workout = await WorkoutApi.single(session.workout_uuid);

        const exercises = session.exercises.map(ex => ExerciseExecution.fromDto(ex));

        return new WorkoutSession(
            session.session_uuid,
            Workout.fromDto(workout),
            session.start_time,
            exercises
        );
    }
}