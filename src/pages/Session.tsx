import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CountDownTimer from "../components/CountDownTimer";
import StopWatch from "../components/StopWatch";
import TabataTimer from "../components/TabataTimer";
import CurrentExercise from "../components/CurrentExercise.tsx";
import Plusknop from "../components/plusknop.tsx";
import API from "../classes/api.ts";

interface SessionState {
    exercises?: ExerciseDTO[];
}

export default function Session() {
    const [selectedTimer, setSelectedTimer] = useState("stopwatch");
    const [expandedByExercise, setExpandedByExercise] = useState<boolean[]>([]);
    const location = useLocation();
    const state = location.state as SessionState | null;
    const exercises = state?.exercises || [];
    const [session,setSession] = useState<ISessionState>();

    useEffect(() => {
        setExpandedByExercise(Array(exercises.length).fill(false));

        const getState = async () => {
            const resp = await API.session.get();
            console.log(resp);
            if (typeof resp !== "string") {
            setSession(resp);
            }
        }
        getState();

    }, [exercises.length]);

    if (!session) return <h1>loadin....</h1>
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
                    session.exercises.map((exercise, exerciseIndex) => (
                        <CurrentExercise
                            key={exercise.exercise_id}
                            exerciseData={exercise}
                            isExpanded={expandedByExercise[exerciseIndex] || false}
                            onToggle={() => {
                                const next = [...expandedByExercise];
                                next[exerciseIndex] = !next[exerciseIndex];
                                setExpandedByExercise(next);
                            }}
                        >
                            <Plusknop
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
