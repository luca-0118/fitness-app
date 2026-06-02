import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Sets from "./Sets.tsx";
import UseSetUpdate from "../../Hooks/UseSetUpdate.ts";

interface CurrentExerciseProps {
    exerciseData: ISessionExercises;
    isCompleted?: boolean;
    isExpanded?: boolean;
    onToggle?: () => void;
    onDeleteSet?: (setIndex: number) => void;
    children?: React.ReactNode;
}

export function CurrentExercise({exerciseData, isCompleted = false, isExpanded = false, onToggle, onDeleteSet, children}: CurrentExerciseProps) {

    const updateSet = UseSetUpdate(exerciseData.exercise_id);


    return (
        <div className={`w-87 bg-components border-2 rounded-xl p-4 mb-4 ${isCompleted ? "border-[#2e8b57]" : "border-bordercolor"}`}>
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between cursor-pointer"
            >
                <h2 className="text-textcolor text-lg font-semibold">{exerciseData.name}</h2>
                <span className="text-accent">
                    {isExpanded ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                </span>
            </button>

            <div className={isExpanded ? "border-t border-bordercolor pt-3 mt-3" : "hidden"}>
                {exerciseData.gif_url && (
                    <div className="bg-white rounded-lg p-2 w-fit mb-3">
                        <img
                            src={exerciseData.gif_url}
                            alt={exerciseData.name}
                            className="w-16 h-16 object-contain"
                        />
                    </div>
                )}

                {exerciseData.sets.map((set, idx) => (
                    <Sets
                        key={idx}
                        setNumber={idx + 1}
                        onDelete={onDeleteSet ? () => onDeleteSet(idx) : undefined}
                        updateFunction={updateSet}
                        data={set}
                    />
                ))}
                {children}
            </div>
        </div>
    );
}
