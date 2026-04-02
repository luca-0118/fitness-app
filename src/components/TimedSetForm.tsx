import { useEffect, useState } from "react";
import { IUseSetUpdateFunction, TimedSet } from "../Hooks/UseSetUpdate.ts";

/**
 * SRP: Responsible only for rendering and syncing the timed-set input fields.
 * Extracted from the monolithic Sets component so that each set type lives in its
 * own file and can evolve independently.
 */
export interface TimedSetFormProps {
    setNumber: number;
    updateFunction: IUseSetUpdateFunction;
    data: IWeightedSet | ITimedSet;
}

const parseNumberInput = (value: string): number | null => {
    if (value.trim() === "") return 0;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
};

export default function TimedSetForm({ updateFunction, setNumber, data }: TimedSetFormProps) {
    const timedData = data as ITimedSet;
    const [time, setTime] = useState(timedData.time);
    const [distance, setDistance] = useState(timedData.distance);

    useEffect(() => {
        if (!time || !distance) return;

        const set: TimedSet = { type: "Timed", time, distance };
        updateFunction(setNumber - 1, set).then(() => { console.log("updated"); });
    }, [time, distance]);

    return (
        <>
            <div className="flex items-center justify-between mb-3">
                <label className="text-white text-base">Time in minutes:</label>
                <input
                    type="text"
                    inputMode="numeric"
                    value={time === 0 ? "" : time}
                    onChange={(e) => {
                        const parsed = parseNumberInput(e.target.value);
                        if (parsed !== null) setTime(parsed);
                    }}
                    className="w-32 bg-[#2e2e2e] border border-[#565d5d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F67631]"
                    placeholder="0"
                />
            </div>

            <div className="flex items-center justify-between">
                <label className="text-white text-base">Distance</label>
                <input
                    type="text"
                    inputMode="decimal"
                    value={distance === 0 ? "" : distance}
                    onChange={(e) => {
                        const parsed = parseNumberInput(e.target.value);
                        if (parsed !== null) setDistance(parsed);
                    }}
                    className="w-32 bg-[#2e2e2e] border border-[#565d5d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F67631]"
                    placeholder="0.0"
                />
            </div>
        </>
    );
}
