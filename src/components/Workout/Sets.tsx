import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { IUseSetUpdateFunction, TimedSet, WeightedSet } from "../../Hooks/UseSetUpdate.ts";

interface SetsProps {
    setNumber?: number;
    onDelete?: () => void;
    updateFunction: IUseSetUpdateFunction;
    data: IWeightedSet | ITimedSet;
    isCompleted: boolean;
}

export default function Sets({ updateFunction, setNumber = 1, onDelete, data, isCompleted }: SetsProps) {

    const parseNumberInput = (value: string): number | null => {
        if (value.trim() === "") return 0;
        const parsed = Number(value);
        return Number.isNaN(parsed) ? null : parsed;
    };

    // You can use this to see what kind of type the value is.
    // it also shows how to use the updateFunction to send a TimeBasedSet.
    // this can be deleted to make way for different solutions.
    // if (data.type !== "Weighted") return <h1 onClick={(_e) => {
    //     const data: TimedSet = {type:"Timed",time: 10.0, distance: 40.0};

    //     updateFunction(setNumber,data)
    //         .then(() => {console.log("time updated")});
    // }}>Incorrect type..</h1>
    //

    if (data.type == "Weighted") {
        const [reps, setReps] = useState(data.reps);
        const [weightInput, setWeightInput] = useState(data.weight === 0 ? "" : String(data.weight));

        useEffect(() => {
            console.log("set up setnr:", setNumber);
            const parsedWeight = parseNumberInput(weightInput);
            if (!reps || parsedWeight === null || parsedWeight === 0) return;

            const data: WeightedSet = { type: "Weighted", reps, weight: parsedWeight };

            updateFunction(setNumber - 1, data)
                .then(() => { console.log("updated") });
        }, [reps, weightInput]);

        return (
            <OuterLayer set_nr={setNumber} onDelete={onDelete} isCompleted={isCompleted}>
                <>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-textcolor text-base">reps:</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={reps === 0 ? "" : reps}
                            onChange={(e) => {
                                const parsed = parseNumberInput(e.target.value);
                                if (parsed !== null) setReps(parsed);
                            }}
                            disabled={isCompleted}
                            className="w-32 bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="0"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-textcolor text-base">weight (Kg):</label>
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
                            disabled={isCompleted}
                            className="w-32 bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="0.0"
                        />
                    </div>
                </>
            </OuterLayer>
        );


    } else {
        const [time, setTime] = useState(data.time);
        const [distance, setDistance] = useState(data.distance);

        useEffect(() => {
            console.log("set up setnr:", setNumber);
            if (!time || !distance) return;

            const data: TimedSet = { type: "Timed", time, distance };

            updateFunction(setNumber - 1, data)
                .then(() => { console.log("updated") });
        }, [time, distance]);

        return (
            <OuterLayer set_nr={setNumber} onDelete={onDelete} isCompleted={isCompleted}>
                <>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-textcolor text-base">Time in minutes:</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={time === 0 ? "" : time}
                            onChange={(e) => {
                                const parsed = parseNumberInput(e.target.value);
                                if (parsed !== null) setTime(parsed);
                            }}
                            disabled={isCompleted}
                            className="w-32 bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="0"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-textcolor text-base">Distance</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={distance === 0 ? "" : distance}
                            onChange={(e) => {
                                const parsed = parseNumberInput(e.target.value);
                                if (parsed !== null) setDistance(parsed);
                            }}
                            disabled={isCompleted}
                            className="w-32 bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="0.0"
                        />
                    </div>
                </>
            </OuterLayer>
        )


    }
}

interface outerLayerProps {
    children: React.ReactNode;
    set_nr: number;
    onDelete?: () => void;
    isCompleted: boolean;
}
function OuterLayer({ children, set_nr, onDelete, isCompleted }: outerLayerProps) {
    return (
        <div className={`border-t pt-4 mt-3 ${isCompleted ? "border-button-start" : "border-bordercolor"}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-textcolor text-lg font-semibold">Set {set_nr}</h3>
                <div className="flex items-center gap-3">
                    {onDelete && set_nr > 1 && (
                        <button
                            onClick={onDelete}
                            className="text-button-stop hover:text-red-400 active:text-red-400 cursor-pointer transition-colors"
                            title="Delete set"
                        >
                            <DeleteIcon sx={{ fontSize: 24 }} />
                        </button>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
}