import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Sets from "./Sets.tsx";
import API from "../classes/api.ts";

interface CurrentExerciseProps {
    exerciseData: ISessionExercises;
    isExpanded?: boolean;
    onToggle?: () => void;
    children?: React.ReactNode;
}

export default function CurrentExercise({ exerciseData, isExpanded = false, onToggle, children }: CurrentExerciseProps) {
    const updateSet = async (set_nr: number, reps: number, weight:number) => {
        const setUpdate: ISetUpdate = {
            exercise_id: exerciseData.exercise_id,
            set_nr,
            reps,
            weight
        }
        const resp = await API.session.updateSet(setUpdate);

        console.log(resp);
    }



    return (
        <div className="w-87 bg-[#1E1E1E] border-2 border-[#565d5d] rounded-xl p-4 mb-4">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between cursor-pointer"
            >
                <h2 className="text-white text-lg font-semibold">{exerciseData.name}</h2>
                <span className="text-[#F67631]">
                    {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </span>
            </button>

            {isExpanded && (
                <div className="border-t border-[#565d5d] pt-3 mt-3">
                    {exerciseData.gif_url && (
                        <div className="bg-white rounded-lg p-2 w-fit mb-3">
                            <img
                                src={exerciseData.gif_url}
                                alt={exerciseData.name}
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                    )}

                    {exerciseData.sets.map((_set,idx) => (
                        <Sets
                            key={idx + 1}
                            setNumber={idx + 1}
                            onDelete={() => {}}
                            updateFunction={updateSet}
                        />
                    ))}
                    {children}
                </div>
            )}
        </div>
    );
}
