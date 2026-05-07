import SessionApi from "../api/SessionApi.ts";
import {SESSION_STORAGE_KEYS} from "../../apis/sessionAPI.ts";



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
}