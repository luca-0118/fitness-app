import BaseApi from "./baseAPI.ts";
import {ISessionState, ITimedSetUpdate, IWeightedSetUpdate, SetUpdate} from "../../types/types.ts";



export default class SessionApi extends BaseApi {

    static async startWorkout(workoutId: string)
    {
        const resp= await this.fetch<string>("start_session", {req: workoutId});

        return this.handleError(resp);
    }

    static async getCurrentSession(sessionId: string)
    {
        // LOL this sessionID is absolutely useless.....
        const resp = await this.fetch<ISessionState>("get_session",{req:sessionId});

        const sessionData = this.handleError(resp);
        console.log(sessionData);
        return sessionData.data;
    }

    static async updateSet(setUpdate: SetUpdate)
    {
        // Chooses one of the two functions in the validators const based on the type.
        const validator = validators[setUpdate.type];

        if (!validator) {
            return { success: false, resp: "updateType not found" };
        }

        // Validates the set
        const error = validator(setUpdate as any);

        if (error) {
            console.log("goofy ahh shit",error);
            return { success: false, resp: error };
        }

        const resp = await this.fetch<string>("update_session_set", { req: setUpdate });
        const data = this.handleError(resp);

        console.log(`updated ${setUpdate.type} set:`, data);

        return { success: true, resp: data };
    }
}


const validators = {
    Weighted: validateWeighted,
    Timed: validateTimed,
} as const;

function validateWeighted(set: IWeightedSetUpdate): string | null {
    if (
        set.set_nr < 0 ||
        !set.exercise_id
    ) return "Not everything has been filled in.";

    return null;
}

function validateTimed(set: ITimedSetUpdate): string | null {
    if (
        set.set_nr < 0 ||
        !set.exercise_id
    ) return "Not everything has been filled in.";

    return null;
}