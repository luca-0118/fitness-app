import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface CurrentExerciseProps {
    exerciseName: string;
    exerciseImage?: string;
    isExpanded?: boolean;
    onToggle?: () => void;
    children?: React.ReactNode;
}

export default function CurrentExercise({ exerciseName, exerciseImage, isExpanded = false, onToggle, children }: CurrentExerciseProps) {
    return (
        <div className="w-87 bg-[#1E1E1E] border-2 border-[#565d5d] rounded-xl p-4 mb-4">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between cursor-pointer"
            >
                <h2 className="text-white text-lg font-semibold">{exerciseName}</h2>
                <span className="text-[#F67631]">
                    {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </span>
            </button>

            {isExpanded && (
                <div className="border-t border-[#565d5d] pt-3 mt-3">
                    {exerciseImage && (
                        <div className="bg-white rounded-lg p-2 w-fit mb-3">
                            <img
                                src={exerciseImage}
                                alt={exerciseName}
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                    )}

                    {children}
                </div>
            )}
        </div>
    );
}
