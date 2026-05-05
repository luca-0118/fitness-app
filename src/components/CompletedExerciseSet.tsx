import {ITimedSet, IWeightedSet} from "../types/types.ts";

interface  WeighedSetProps {
    setData: IWeightedSet
    setNr:number;
}
interface  TimedSetProps {
    setData: ITimedSet
    setNr:number;
}

//TODO implement kg /lbs based on user preference
const weighType = "kg";
const distanceType = "km";

function Weighed({setData,setNr}: WeighedSetProps) {
    return                <tr className="weighed-set border-b border-zinc-800">
        <td className="py-1 text-lg font-SeuratProB text-end text-zinc-200">{setNr}</td>
        <td className="py-1 text-lg font-SeuratProB text-end text-zinc-200">{setData.reps}</td>
        <td className="py-1 text-lg font-SeuratProB px-4 text-end text-zinc-200">{setData.weight}{weighType}</td>
    </tr>
}

function Timed({setData,setNr}:TimedSetProps) {
    return <tr className="timed-set border-b border-zinc-800">
        <td className="py-1 text-lg font-SeuratProB text-end text-zinc-200">{setNr}</td>
        <td className="py-1 text-lg font-SeuratProB text-end text-zinc-200">{setData.distance}{distanceType}</td>
        <td className="py-1 text-lg font-SeuratProB px-4 text-end text-zinc-200">{setData.time}</td>
    </tr>
}


export const CompletedExerciseSet = {
    weighted: Weighed,
    timed: Timed
}