import {useEffect, useState} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import {IUseSetUpdateFunction, TimedSet, WeightedSet} from "../Hooks/UseSetUpdate.ts";

interface SetsProps {
    setNumber?: number;
    onDelete?: () => void;
    updateFunction: IUseSetUpdateFunction
    data: IWeightedSet | ITimedSet
}

export default function Sets({updateFunction, setNumber = 1, onDelete, data }: SetsProps) {

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
        const [weight, setWeight] = useState(data.weight);

            useEffect(() => {
        console.log("set up setnr:",setNumber);
        if (!reps || !weight) return;

            const data: WeightedSet = {type:"Weighted",reps,weight};

            updateFunction(setNumber - 1,data)
                .then(() => {console.log("updated")});
    }, [reps,weight]);

    return ( 
            <OuterLayer set_nr={setNumber} onDelete={onDelete|| (() => {return;})}>
                <>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-white text-base">reps:</label>
                        <input
                            type="numbr"
                            inputMode="numeric"
                            value={reps}
                            onChange={(e) => setReps(Number(e.target.value))}
                            className="w-32 bg-[#2e2e2e] border border-[#565d5d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F67631]"
                            placeholder="reps"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-white text-base">weight (Kg):</label>
                        <input
                            type="number"
                            inputMode="decimal"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="w-32 bg-[#2e2e2e] border border-[#565d5d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F67631]"
                            placeholder="weight"
                        />
                    </div>
                </>
            </OuterLayer>
        );


    } else {
        const [time, setTime] = useState(data.time);
        const [distance, setDistance] = useState(data.distance);

                    useEffect(() => {
        console.log("set up setnr:",setNumber);
        if (!time || !distance) return;

            const data: TimedSet = {type:"Timed",time,distance};

            updateFunction(setNumber - 1,data)
                .then(() => {console.log("updated")});
    }, [time,distance]);

    return (
        <OuterLayer set_nr={setNumber} onDelete={onDelete|| (() => {return;})}>
            <>
                <div className="flex items-center justify-between mb-3">
                    <label className="text-white text-base">Time in minutes:</label>
                    <input
                        type="number"
                        inputMode="numeric"
                        value={time}
                        onChange={(e) => setTime(Number(e.target.value))}
                        className="w-32 bg-[#2e2e2e] border border-[#565d5d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F67631]"
                        placeholder="time in minutes"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label className="text-white text-base">Distance</label>
                    <input
                        type="number"
                        inputMode="decimal"
                        value={distance}
                        onChange={(e) => setDistance(Number(e.target.value))}
                        className="w-32 bg-[#2e2e2e] border border-[#565d5d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F67631]"
                        placeholder="km"
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
    onDelete: () => void;
}
function OuterLayer({children,set_nr,onDelete}:outerLayerProps) {
    return (
        <div className="border-t border-[#565d5d] pt-4 mt-3">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Set {set_nr}</h3>
                {onDelete && set_nr > 3 && (
                    <button
                        onClick={onDelete}
                        className="text-red-500 hover:text-red-400 active:text-red-400 cursor-pointer transition-colors"
                        title="Delete set"
                    >
                        <DeleteIcon sx={{ fontSize: 24 }} />
                    </button>
                )}
            </div>
            {children}
        </div>
    );   
}