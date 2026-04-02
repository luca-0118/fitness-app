import { useEffect, useState } from "react";
import { IUseSetUpdateFunction, WeightedSet } from "../Hooks/UseSetUpdate.ts";

/**
 * SRP: Responsible only for rendering and syncing the weighted-set input fields.
 * Extracted from the monolithic Sets component so that each set type lives in its
 * own file and can evolve independently.
 */
export interface WeightedSetFormProps {
    setNumber: number;
    updateFunction: IUseSetUpdateFunction;
    data: IWeightedSet | ITimedSet;
}

const parseNumberInput = (value: string): number | null => {
    if (value.trim() === "") return 0;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
};

export default function WeightedSetForm({ updateFunction, setNumber, data }: WeightedSetFormProps) {
    const weightedData = data as IWeightedSet;
    const [reps, setReps] = useState(weightedData.reps);
    const [weightInput, setWeightInput] = useState(weightedData.weight === 0 ? "" : String(weightedData.weight));

    useEffect(() => {
        const parsedWeight = parseNumberInput(weightInput);
        if (!reps || parsedWeight === null || parsedWeight === 0) return;

        const set: WeightedSet = { type: "Weighted", reps, weight: parsedWeight };
        updateFunction(setNumber - 1, set).then(() => { console.log("updated"); });
    }, [reps, weightInput]);

    return (
        <>
            <div className="flex items-center justify-between mb-3">
                <label className="text-white text-base">reps:</label>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={reps === 0 ? "" : reps}
                    onChange={(e) => {
                        const parsed = parseNumberInput(e.target.value);
                        if (parsed !== null) setReps(parsed);
                    }}
                    className="w-32 bg-[#2e2e2e] border border-[#565d5d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F67631]"
                    placeholder="0"
                />
            </div>

            <div className="flex items-center justify-between">
                <label className="text-white text-base">weight (Kg):</label>
                <input
                    type="text"
                    inputMode="decimal"
                    value={weightInput}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                            setWeightInput(value);
                        }
                    }}
                    className="w-32 bg-[#2e2e2e] border border-[#565d5d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F67631]"
                    placeholder="0.0"
                />
            </div>
        </>
    );
}
