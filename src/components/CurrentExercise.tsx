import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Sets from "./Sets.tsx";
import UseSetUpdate from "../Hooks/UseSetUpdate.ts";

interface CurrentExerciseProps {
    exerciseData: ISessionExercises;
    isExpanded?: boolean;
    isCompleted?: boolean;
    onToggle?: () => void;
    onDeleteSet?: (setIndex: number) => void;
    children?: React.ReactNode;
}

export function CurrentExercise({exerciseData, isExpanded = false, isCompleted = false, onToggle, onDeleteSet, children}: CurrentExerciseProps) {

    const updateSet = UseSetUpdate(exerciseData.exercise_id);


    return (
        <div className={`w-87 bg-[#1E1E1E] border-2 rounded-xl p-4 mb-4 transition-colors ${isCompleted ? "border-green-500" : "border-[#565d5d]"}`}>
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between cursor-pointer"
            >
                <h2 className={`text-lg font-semibold ${isCompleted ? "text-green-500" : "text-white"}`}>{exerciseData.name}</h2>
                <span className={isCompleted ? "text-green-500" : "text-[#F67631]"}>
                    {isExpanded ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                </span>
            </button>

            {isExpanded && (
                <div className={`border-t pt-3 mt-3 ${isCompleted ? "border-green-500/50" : "border-[#565d5d]"}`}>
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
                            onDelete={() => onDeleteSet?.(idx)}
                            updateFunction={updateSet}
                            data={set}
                        />
                    ))}
                    {children}
                </div>
            )}
        </div>
    );
}
