import { ApiClient } from "../classes/api";

export const SESSION_STORAGE_KEYS = {
    id: "workoutSessionId",
    startedAt: "workoutSessionStartedAt",
    workoutName: "workoutSessionName",
} as const;

export default  class sessionAPI {

    /**
     * Starts a session for a workout.
     * @param workout_id The provided ID of the workout.
     * @returns A boolean indicating if the session is started sucessfully.
     */
    public async start(workout_id: string): Promise<Boolean> {
        const resp= await ApiClient.send<string>("start_session", {req: workout_id});

        const sessionId= ApiClient.assertOk(resp);
        
        if (!resp.ok || !sessionId) return false; 

        localStorage.setItem(SESSION_STORAGE_KEYS.id, sessionId);
        localStorage.setItem(SESSION_STORAGE_KEYS.startedAt, Date.now().toString());

        return localStorage.getItem(SESSION_STORAGE_KEYS.id) !== null;
    }


    /** Uses stored sessionId in localstorage to get the workout session data.
     * @returns ISessionState | error string
     */
    public async get(): Promise<ISessionState|string> {
        const session_id = localStorage.getItem(SESSION_STORAGE_KEYS.id);
        if (!session_id) return "session not found";

        // LOL this sessionID is absolutely useless.....
        const resp = await ApiClient.send<ISessionState>("get_session",{sessionId: session_id});
        const sessionData = ApiClient.assertOk(resp);
        console.log(sessionData);
        return sessionData;
    }

    public async updateSet(setUpdate: ITimedSetUpdate|IWeightedSetUpdate): Promise<{success: boolean, resp: string }> {
        const validator = validators[setUpdate.type];

        if (!validator) {
            return { success: false, resp: "updateType not found" };
        }

        const error = validator(setUpdate as any);
        if (error) {
            return { success: false, resp: error };
        }

        const resp = await ApiClient.send<string>("update_session_set", { req: setUpdate });
        const data = ApiClient.assertOk(resp);

        console.log(`updated ${setUpdate.type} set:`, data);

        return { success: true, resp: data };
    }

    public async complete(): Promise<{ok:boolean,msg:string}> {
        if (!localStorage.getItem(SESSION_STORAGE_KEYS.id))
            return {ok: false, msg:"no workout active to save."}


        await ApiClient.send<string>("complete_session");

        localStorage.removeItem(SESSION_STORAGE_KEYS.id);
        localStorage.removeItem(SESSION_STORAGE_KEYS.startedAt);
        localStorage.removeItem(SESSION_STORAGE_KEYS.workoutName);
        return {
            ok: true,
            msg:"cleared"
        }
    }

    public async addSet(exerciseIdx: number): Promise<boolean> {
        const resp = await ApiClient.send<boolean>("add_session_set",{req: exerciseIdx});

        return ApiClient.assertOk<boolean>(resp);
    }
    public async removeSet(exerciseIdx: number): Promise<boolean> {
        const resp = await ApiClient.send<boolean>("remove_session_set",{req: exerciseIdx});

        return ApiClient.assertOk<boolean>(resp);
    }

}

const validators = {
    Weighted: validateWeighted,
    Timed: validateTimed,
} as const;

function validateWeighted(set: IWeightedSetUpdate): string | null {
    if (
        set.set_nr < 0 ||
        !set.exercise_id ||
        !set.reps ||
        !set.weight
    ) return "Not everything has been filled in.";

    return null;
}

function validateTimed(set: ITimedSetUpdate): string | null {
    if (
        set.set_nr < 0 ||
        !set.exercise_id ||
        !set.distance ||
        !set.time
    ) return "Not everything has been filled in.";

    return null;
}