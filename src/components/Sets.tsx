import {useEffect, useState} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import {IUseSetUpdateFunction, TimedSet, WeightedSet} from "../Hooks/UseSetUpdate.ts";

interface SetsProps {
    setNumber?: number;
    onDelete?: () => void;
    updateFunction: IUseSetUpdateFunction
    data: IWeightedSet | ITimedSet
}

export default function Sets({updateFunction, setNumber = 0, onDelete, data }: SetsProps) {

    // You can use this to see what kind of type the value is.
    // it also shows how to use the updateFunction to send a TimeBasedSet.
    // this can be deleted to make way for different solutions.
    if (data.type !== "Weighted") return <h1 onClick={(_e) => {
        const data: TimedSet = {type:"Timed",time: 10.0, distance: 40.0};

        updateFunction(setNumber,data)
            .then(() => {console.log("time updated")});
    }}>Incorrect type..</h1>
    //

    const [reps, setReps] = useState(data.reps);
    const [weight, setWeight] = useState(data.weight);
    const repsOptions = Array.from({ length: 51 }, (_, i) => i);

    useEffect(() => {
        console.log("set up setnr:",setNumber);
        if (!reps || !weight) return;

            const data: WeightedSet = {type:"Weighted",reps,weight};

            updateFunction(setNumber,data)
                .then(() => {console.log("updated")});
    }, [reps,weight]);

    return (
        <div className="border-t border-[#565d5d] pt-4 mt-3">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Set {setNumber}</h3>
                {onDelete && setNumber > 3 && (
                    <button
                        onClick={onDelete}
                        className="text-red-500 hover:text-red-400 cursor-pointer transition-colors"
                        title="Delete set"
                    >
                        <DeleteIcon sx={{ fontSize: 24 }} />
                    </button>
                )}
            </div>

            <div className="flex items-center justify-between mb-3">
                <label className="text-white text-base">Reps:</label>
                <select
                    value={reps}
                    onChange={(e) => setReps(Number(e.target.value))}
                    className="w-32 bg-[#2e2e2e] border border-[#565d5d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F67631] cursor-pointer"
                >
                    {repsOptions.map((value) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center justify-between">
                <label className="text-white text-base">Weight (kg):</label>
                <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-32 bg-[#2e2e2e] border border-[#565d5d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F67631]"
                    placeholder="0.0"
                />
            </div>
        </div>
    );
}