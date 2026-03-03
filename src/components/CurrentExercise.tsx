interface CurrentExerciseProps {
    exerciseName: string;
    exerciseImage?: string;
}

export default function CurrentExercise({ exerciseName, exerciseImage }: CurrentExerciseProps) {
    return (
        <div className="w-87 bg-[#1E1E1E] border-2 border-[#565d5d] rounded-xl p-4 mb-4">
            <h2 className="text-white text-lg font-semibold mb-3">Current Exercise:</h2>
            <div className="border-t border-[#565d5d] pt-3">
                <p className="text-white text-base mb-3">{exerciseName}</p>
                {exerciseImage && (
                    <div className="bg-white rounded-lg p-2 w-fit">
                        <img 
                            src={exerciseImage} 
                            alt={exerciseName}
                            className="w-16 h-16 object-contain"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
