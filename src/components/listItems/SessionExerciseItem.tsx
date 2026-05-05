import {ExerciseSet, ExerciseSetUpdate, ISessionExercises} from "../../types/types.ts";
import {ChevronDownIcon} from "flowbite-react/icons/chevron-down-icon";
import SetItem from "./SetItem.tsx";
import {useMemo} from "react";
import PrimaryButton from "../ui/buttons/PrimaryButton.tsx";

interface SessionExerciseItemProps {
    exercise: ISessionExercises
    onClick: () => void
    isOpen: boolean
    onSetUpdate: (update:ExerciseSetUpdate) => void
    onSetAdd?: (type: "Weighted"|"Timed",exercise_id:string) => void;
}


/**
 * Creates a new exercise Item you can follow during your session.
 * @param options
 * @param options.exercise - Data of the exercise.
 * @param options.isOpen - tells us if the Item should be fully expanded.
 * @param options.onClick - functionality to happen once we click on the element.
 * @param options.onSetUpdate - the function which should fire once the set updates.
 * @constructor
 */
export default function SessionExerciseItem({exercise, onClick, isOpen,onSetUpdate,onSetAdd}:SessionExerciseItemProps) {
    const chevronRotation = isOpen ? "rotate-0" : "rotate-180";

    // Checks if sets all sets are completed, when they are, we turn the border green.
    const isInvalidSet = (set: ExerciseSet) =>
        (set.type === "Weighted" && (set.reps === 0 || set.weight === 0)) ||
        (set.type === "Timed" && (set.time === 0 || set.distance === 0));

    const exerciseCompleted = useMemo(() => !exercise.sets.some(isInvalidSet),
        [exercise.sets]
    );


    return <div className={`session-exercise-item w-full h-fit border ${exerciseCompleted ? "border-green-400 border-2" : "border-bordercolor"} rounded flex flex-col cursor-default`}>
        <div className={"exercise-header flex flex-row gap-4 items-center justify-center w-full h-full pr-4"} onClick={onClick}>
            <div className="img-container w-fit">
                <img className={"h-24 w-24 object-cover rounded-l"} src={exercise.gif_url} alt="" loading={"lazy"} decoding={"async"}/>
            </div>
        <h2 className={"exercise-name text-textcolor text-lg font-semibold select-none flex-1"}>{exercise.name} </h2>
            <ChevronDownIcon className={`${chevronRotation} text-4xl text-accent transition-all`}/>
        </div>
        {isOpen ? <div className={"exercise-set-list flex flex-col h-full w-full flex-1 p-2 gap-4 border-t border-t-bordercolor"}>
            {exercise.sets.map((set,idx) => <SetItem key={exercise.exercise_id+idx} onChange={onSetUpdate} set={set} exerciseId={exercise.exercise_id} setNr={idx}/>)}
            <PrimaryButton onClick={() => {
                onSetAdd?.(exercise.sets[0].type,exercise.exercise_id)
            }} className={"h-fit bg-green-500 shadow-none hover:bg-green-500 active:bg-green-600"}><p className={"w-full items-center"}>Add set</p></PrimaryButton>
        </div>:null}

    </div>
}


