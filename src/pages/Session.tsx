import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CountDownTimer from "../components/CountDownTimer";
import StopWatch from "../components/StopWatch";
import TabataTimer from "../components/TabataTimer";
import Sets from "../components/Sets.tsx";
import CurrentExercise from "../components/CurrentExercise.tsx";
import Plusknop from "../components/plusknop.tsx";
import API from "../classes/api.ts";

interface SessionState {
    exercises?: ExerciseDTO[];
}

export default function Session() {
    const navigate = useNavigate();
    const [selectedTimer, setSelectedTimer] = useState("stopwatch");
    const [numSetsByExercise, setNumSetsByExercise] = useState<number[]>([]);
    const [expandedByExercise, setExpandedByExercise] = useState<boolean[]>([]);
    const [isFinishing, setIsFinishing] = useState(false);
    const location = useLocation();
    const state = location.state as SessionState | null;
    const exercises = state?.exercises || [];

    useEffect(() => {
        setNumSetsByExercise(Array(exercises.length).fill(3));
        setExpandedByExercise(Array(exercises.length).fill(false));

        const getState = async () => {
            const resp = await API.session.get();
            console.log(resp);
        }
        getState();

    }, [exercises.length]);

    const handleFinishWorkout = async () => {
        if (isFinishing) {
            return;
        }

        try {
            setIsFinishing(true);
            const resp = await API.session.complete();

            if (resp.ok) {
                navigate("/");
            }
        } catch (error) {
            console.error("Failed to finish workout", error);
        } finally {
            setIsFinishing(false);
        }
    };

    return (
        <>
            <div className="w-full flex flex-col items-center pt-6 pb-44">
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
                                { length: numSetsByExercise[exerciseIndex] || 3 },
                                (_, setIndex) => (
                                    <Sets
                                        key={setIndex + 1}
                                        setNumber={setIndex + 1}
                                        onDelete={() => {
                                            const next = [...numSetsByExercise];
                                            next[exerciseIndex] = Math.max(
                                                1,
                                                (next[exerciseIndex] || 3) - 1,
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
                                        (next[exerciseIndex] || 3) + 1;
                                    setNumSetsByExercise(next);
                                }}
                                className="mt-3 w-77 h-12 rounded-full bg-[#2e2e2e] hover:bg-[#3a3a3a]  justify-center transition-colors"
                                iconSize={32}
                            />
                        </CurrentExercise>
                    ))
                )}

                <div className="fixed bottom-24 left-1/2 z-40 w-87 -translate-x-1/2">
                    <button
                        type="button"
                        onClick={handleFinishWorkout}
                        disabled={isFinishing}
                        className="w-full rounded-xl border border-[#414141] bg-[#F67631] px-5 py-4 font-bold text-white transition-colors hover:bg-[#ff8a4a] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isFinishing ? "Finishing..." : "Finish Workout"}
                    </button>
                </div>
            </div>
        </>
    );
}
