import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CountDownTimer from "../components/CountDownTimer";
import StopWatch from "../components/StopWatch";
import TabataTimer from "../components/TabataTimer";
import Sets from "../components/Sets.tsx";
import CurrentExercise from "../components/CurrentExercise.tsx";
import Plusknop from "../components/plusknop.tsx";

interface SessionState {
    exercises?: ExerciseDTO[];
}

export default function Session() {
    const [selectedTimer, setSelectedTimer] = useState("stopwatch");
    const [numSetsByExercise, setNumSetsByExercise] = useState<number[]>([]);
    const [expandedByExercise, setExpandedByExercise] = useState<boolean[]>([]);
    const location = useLocation();
    const state = location.state as SessionState | null;
    const exercises = state?.exercises || [];

    useEffect(() => {
        setNumSetsByExercise(Array(exercises.length).fill(1));
        setExpandedByExercise(Array(exercises.length).fill(false));
    }, [exercises.length]);

    return (
        <>
            <div className="w-full flex flex-col items-center pt-6 pb-24">
                <div className="relative mb-6">
                    {selectedTimer === "countdown" && <CountDownTimer onTimerChange={setSelectedTimer} />}
                    {selectedTimer === "stopwatch" && <StopWatch onTimerChange={setSelectedTimer} />}
                    {selectedTimer === "tabata" && <TabataTimer onTimerChange={setSelectedTimer} />}
                </div>

                {exercises.length === 0 ? (
                    <div className="w-87 bg-[#1E1E1E] border-2 border-[#565d5d] rounded-xl p-4 mb-4 text-center">
                        <p className="text-white">No exercises selected.</p>
                    </div>
                ) : (
                    exercises.map((exercise, exerciseIndex) => (
                        <CurrentExercise
                            key={exercise.id}
                            exerciseName={exercise.name}
                            exerciseImage={exercise.data}
                            isExpanded={expandedByExercise[exerciseIndex] || false}
                            onToggle={() => {
                                const next = [...expandedByExercise];
                                next[exerciseIndex] = !next[exerciseIndex];
                                setExpandedByExercise(next);
                            }}
                        >
                            {Array.from(
                                { length: numSetsByExercise[exerciseIndex] || 1 },
                                (_, setIndex) => (
                                    <Sets
                                        key={setIndex + 1}
                                        setNumber={setIndex + 1}
                                        onDelete={() => {
                                            const next = [...numSetsByExercise];
                                            next[exerciseIndex] = Math.max(
                                                1,
                                                (next[exerciseIndex] || 1) - 1,
                                            );
                                            setNumSetsByExercise(next);
                                        }}
                                    />
                                ),
                            )}

                            <Plusknop
                                onClick={() => {
                                    const next = [...numSetsByExercise];
                                    next[exerciseIndex] =
                                        (next[exerciseIndex] || 1) + 1;
                                    setNumSetsByExercise(next);
                                }}
                                className="mt-3 w-77 h-12 rounded-full bg-[#2e2e2e] hover:bg-[#3a3a3a]  justify-center transition-colors"
                                iconSize={32}
                            />
                        </CurrentExercise>
                    ))
                )}
            </div>
        </>
    );
}
