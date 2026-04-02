import { ApiClient } from "../classes/api";
import { LocalStorageService } from "../services/StorageService";

export const SESSION_STORAGE_KEYS = {
    id: "workoutSessionId",
    startedAt: "workoutSessionStartedAt",
    workoutName: "workoutSessionName",
} as const;

/**
 * SRP: Session-specific API calls only.  All storage access is delegated to an
 * injected IStorageService so that this class does not depend on a concrete
 * persistence mechanism.
 *
 * DIP: Depends on the IStorageService abstraction rather than a concrete
 * localStorage implementation.
 */
export default class sessionAPI implements ISessionAPI {
    private storage: IStorageService;

    /**
     * @param storage - Storage service for persisting session identifiers.
     *   Defaults to LocalStorageService; can be replaced for testing.
     */
    constructor(storage: IStorageService = new LocalStorageService()) {
        this.storage = storage;
    }

    /**
     * Starts a session for a workout.
     * @param workout_id The provided ID of the workout.
     * @returns A boolean indicating if the session started successfully.
     */
    public async start(workout_id: string): Promise<boolean> {
        const resp = await ApiClient.send<string>("start_session", { req: workout_id });
        const sessionId = ApiClient.assertOk(resp);

        if (!sessionId) return false;

        this.storage.setItem(SESSION_STORAGE_KEYS.id, sessionId);
        this.storage.setItem(SESSION_STORAGE_KEYS.startedAt, Date.now().toString());

        return this.storage.getItem(SESSION_STORAGE_KEYS.id) !== null;
    }

    /**
     * Uses the stored session ID to fetch workout session data.
     *
     * LSP: Always returns ISessionState or throws — never returns an error
     * string, keeping the contract consistent across all callers.
     *
     * @throws Error when no active session is found in storage.
     */
    public async get(): Promise<ISessionState> {
        const session_id = this.storage.getItem(SESSION_STORAGE_KEYS.id);
        if (!session_id) throw new Error("No active session found.");

        const resp = await ApiClient.send<ISessionState>("get_session", { sessionId: session_id });
        const sessionData = ApiClient.assertOk(resp);
        console.log(sessionData);
        return sessionData;
    }

    public async updateSet(setUpdate: ITimedSetUpdate | IWeightedSetUpdate): Promise<{ success: boolean; resp: string }> {
        const validator = validators[setUpdate.type];

        if (!validator) {
            return { success: false, resp: "updateType not found" };
        }

        const error = validator(setUpdate);
        if (error) {
            return { success: false, resp: error };
        }

        const resp = await ApiClient.send<string>("update_session_set", { req: setUpdate });
        const data = ApiClient.assertOk(resp);

        console.log(`updated ${setUpdate.type} set:`, data);

        return { success: true, resp: data };
    }

    public async complete(): Promise<{ ok: boolean; msg: string }> {
        if (!this.storage.getItem(SESSION_STORAGE_KEYS.id))
            return { ok: false, msg: "no workout active to save." };

        await ApiClient.send<string>("complete_session");

        this.storage.removeItem(SESSION_STORAGE_KEYS.id);
        this.storage.removeItem(SESSION_STORAGE_KEYS.startedAt);
        this.storage.removeItem(SESSION_STORAGE_KEYS.workoutName);

        return { ok: true, msg: "cleared" };
    }
}

type SetUpdateValidator = (set: IWeightedSetUpdate | ITimedSetUpdate) => string | null;

const validators: Record<string, SetUpdateValidator> = {
    Weighted: (set) => validateWeighted(set as IWeightedSetUpdate),
    Timed: (set) => validateTimed(set as ITimedSetUpdate),
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
