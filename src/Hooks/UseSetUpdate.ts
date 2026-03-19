import API from "../classes/api.ts";

type UseSetUpdateProps = (set_nr: number, data: WeightedSet|TimedSet) => Promise<void>;

export interface WeightedSet {
    type: "Weighted",
    reps: number,
    weight: number
}

export interface TimedSet {
    type: "Timed",
    time: number,
    distance: number
}

/**
 * Updates the set based on the number of given parameters.
 * @param set_nr - the current position of the set in the list.
 * @param data - Either the structure of a timed or weighted set, indicated by `type:"Weighted"` or `type:"Timed"`
 */
export type IUseSetUpdateFunction = (set_nr: number ,data: TimedSet|WeightedSet) => Promise<void>;


/**
 * UseSetUpdate sets up a hook in order to update sets.
 * By connecting the exercise_ID, it has a connection to said workoutin memory.
 * @param exercise_id - the provided ID of the exericse
 * @constructor
 * @returns UpdateSet - A function in order to call and update any of the sets.
 *
 */
export default function UseSetUpdate(exercise_id: string): UseSetUpdateProps {

    /**
     * Updates the set based on the number of given parameters.
     * @param set_nr - the current position of the set in the list.
     * @param data - Either the structure of a timed or weighted set, indicated by `type:"Weighted"` or `type:"Timed"`
     */
    const UpdateSet = async (set_nr:number  , data: TimedSet|WeightedSet): Promise<void> => {
        let setUpdate: IWeightedSetUpdate | ITimedSetUpdate;
        if (data.type == "Weighted") {
            setUpdate = {
                exercise_id: exercise_id,
                type:"Weighted",
                set_nr,
                reps: data.reps,
                weight: data.weight,
            } as IWeightedSetUpdate
        } else {
            setUpdate = {
                exercise_id: exercise_id,
                type:"Timed",
                set_nr,
                time: data.time,
                distance: data.distance
            } as ITimedSetUpdate
        }

        const resp = await API.session.updateSet(setUpdate);

        console.log("hook response:",resp);
    }

    return UpdateSet;
}