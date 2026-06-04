import { ActionDispatch,  ReactNode, useEffect, useState } from "react";
import { Iworkout } from "../../context/WorkoutContext.tsx"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from "react-router-dom";
import { ExerciseAction, ExercisesActionKind, ExerciseState } from "../../Hooks/reducers/exerciseSelectReducer.ts";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

type SelectedExerciseModalProps = {
    dispatch: ActionDispatch<[action: ExerciseAction]>;
    state: ExerciseState;
    saveFunc: () => void;
}
export default function SelectedExerciseModal({dispatch,state, saveFunc}:SelectedExerciseModalProps) {
    const [exerciseRows,setExerciseRows] = useState<ReactNode[]>([]);
    const [open,isOpen] = useState<boolean>(true);
    const navigate = useNavigate();
    const exerciseCount = state.exercises.length;

    useEffect(() =>{
        const rows = state.exercises.map((exercise) =>
            <ExerciseRow exercise={exercise}
                         dispatcher={dispatch}
            />);
        setExerciseRows(rows);
    },[state.exercises]);

    return <div className="absolute z-30 bottom-20 left-[2dvw] w-[96dvw] text-textcolor">
        <ul className={`px-2 pt-2 mx-4 bg-accent-action flex gap-2 flex-col rounded-t-2xl overflow-y-scroll max-h-30 ${exerciseRows.length == 0 || !open ? "hidden":""}`}>
            {exerciseRows}
        </ul>
        <div className="bg-accent flex justify-between pr-8 pl-2 rounded-xl items-center border border-accent">
            <ListOpenButton open={open} onOpen={(opened) => {isOpen(opened)}}/>
            <p className="text-2xl">{exerciseCount} exercise{exerciseCount == 1 ? "" : "s"} added</p>
            <button className="text-4xl" onClick={() => {
                saveFunc();
                navigate(-1);
            }}>{exerciseCount > 0 ? "Add":"Back"}</button>
        </div>
    </div>
}


type ListOpenButtonProps = {
    open: boolean;
    onOpen: (val: boolean) => void
}
/**
 * Inline component to handle opening and closing the modal with the list of exercises.
 * @param open - a true false boolean required to tell us if the modal is open or not
 * @param onOpen - wrapper of the isOpen functionality.
 * @constructor
 */
function ListOpenButton({open,onOpen}:ListOpenButtonProps): ReactNode {
    const handleOpen = () => {
        onOpen(!open);
    }

    return <div onClick={handleOpen}>
        {open ? <ArrowDropUpIcon  style={{rotate: "180deg"}}/> : <ArrowDropUpIcon/>}
    </div>
}


type exerciseRowProps = {
    exercise: Iworkout;
    dispatcher: ActionDispatch<[action: ExerciseAction]>
}
/**
 * Seperate in-file component for the rows to keep the code a bit more structured in the for loop.
 * @param exercise - the details of the exercise
 * @param dispatcher - dispatcher object from our Reducer
 * @constructor
 */
function ExerciseRow({exercise,dispatcher}: exerciseRowProps): ReactNode {
    return <>
        <li className="flex items-center justify-between" key={exercise.id}>
            <p className="text-2xl text-textcolor">{exercise.name}</p>
            <div className="randomIconWrapperLOL" onClick={() => {
                dispatcher({
                    type: ExercisesActionKind.UNSELECT,
                    payload: exercise});
            }}>
                <DeleteOutlineIcon style={{fontSize: 32}}/>
            </div>
        </li>
    </>;

}