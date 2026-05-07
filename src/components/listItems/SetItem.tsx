import { parseNumberInput } from "../../types/Helpers.ts";
import {ExerciseSet, ExerciseSetUpdate} from "../../types/types.ts";
import WeightedSet from "../../core/entities/sets/WeightedSet.ts";
import TimedSet from "../../core/entities/sets/TimedSet.ts";

interface SetItemProps{
    set: ExerciseSet;
    onChange: (updated: ExerciseSetUpdate) => void;
    exerciseId: string,
    setNr: number
}

/**
 * The merge element for both the weighted and the timed set.
 * Contains both elements below
 *
 * @param param0
 * @param param0.set
 * @constructor
 */
export default function SetItem({ set, onChange,exerciseId,setNr}: SetItemProps) {

    if (set instanceof WeightedSet) {
        return <div className={"set flex flex-col gap-0"}>
            <strong className={"text-textcolor select-none"}>Set {setNr+1}</strong>
            <WeightedSetComponent weight={set.weight.toString()}
                         reps={set.reps}
                         onChange={
                            (reps,weight) => onChange({
                                type: "Weighted",
                                weight: Number(weight),
                                reps,
                                exercise_id: exerciseId,
                                set_nr: setNr
                            })
                         }
            />
        </div>
    }

    if (set instanceof TimedSet)
        return <div className={"set flex flex-col gap-1"}>
            <strong className={"text-textcolor select-none"}>Set {setNr+1}</strong>
            <TimedSetComponent time={set.time}
                      distance={set.distance}
                      onChange={
                            (time,distance) => onChange({
                                type: "Timed",
                                time,
                                distance,
                                exercise_id: exerciseId,
                                set_nr: setNr
                            })
                       }
            />
        </div>
}

interface WeightedSetProps {
    reps: number;
    weight: string;
    onChange: (reps: number, weight: string) => void;
}

function WeightedSetComponent({reps, weight, onChange}:WeightedSetProps) {
    return (
        <div className="flex flex-col gap-2">

            <div className="flex items-center justify-between">
                <label className="text-textcolor text-base select-none">reps:</label>
                <input
                    type="number"
                    value={reps}
                    className="w-32 bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed "
                    onChange={(e) => {
                        const val = Number(e.target.value);
                        onChange(val, weight);
                    }}
                />
            </div>

            <div className="flex items-center justify-between">
                <label className="text-textcolor text-base select-none">weight:</label>
                <input
                    type="text"
                    value={weight}
                    className="w-32 bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*\.?\d*$/.test(val)) {
                            onChange(reps, val);
                        }
                    }}
                />
            </div>

        </div>
    );
}


interface TimedSetProps {
    time: number;
    distance:number;
    onChange: (time:number,distance:number) => void
}
function TimedSetComponent({time,distance,onChange}:TimedSetProps) {
    return <div className="flex flex-col gap-2">
                
                <div className="flex items-center justify-between">
                    <label className="text-textcolor text-base select-none">Time in minutes:</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={time === 0 ? "" : time}
                        onChange={(e) => {
                            const parsed = parseNumberInput(e.target.value);
                            if (parsed !== null) onChange(parsed,distance);
                        }}
                        className="w-32 bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="0"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label className="text-textcolor text-base select-none">Distance</label>
                    <input
                        type="text"
                        inputMode="decimal"
                        value={distance === 0 ? "" : distance}
                        onChange={(e) => {
                            const parsed = parseNumberInput(e.target.value);
                            if (parsed !== null) onChange(time,parsed)
                        }}
                        className="w-32 bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="0.0"
                    />
                </div>
            </div>
}