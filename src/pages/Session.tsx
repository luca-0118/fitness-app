import { useEffect, useState } from "react";
import CountDownTimer from "../components/CountDownTimer";
import StopWatch from "../components/StopWatch";
import TabataTimer from "../components/TabataTimer";
import {CurrentExercise} from "../components/CurrentExercise.tsx";
import API from "../classes/api.ts";

export default function Session() {
    const [selectedTimer, setSelectedTimer] = useState("stopwatch");
    const [expandedByExercise, setExpandedByExercise] = useState<boolean[]>([]);
    const [session,setSession] = useState<ISessionState>();

    useEffect(() => {
        const getState = async () => {
            const resp = await API.session.get();
            console.log(resp);
            if (typeof resp !== "string") {
                setSession(resp);
                setExpandedByExercise(Array(resp.exercises.length).fill(false));
            }
        }
        getState();

    }, []);

    if (!session) return <h1>loading....</h1>
    return (
        <>
            <div className="w-full flex flex-col items-center pt-6 pb-24">
                <div className="relative mb-6">
                    {selectedTimer === "countdown" && <CountDownTimer onTimerChange={setSelectedTimer} />}
                    {selectedTimer === "stopwatch" && <StopWatch onTimerChange={setSelectedTimer} />}
                    {selectedTimer === "tabata" && <TabataTimer onTimerChange={setSelectedTimer} />}
                </div>

                {session.exercises.length === 0 ? (
                    <div className="w-87 bg-[#1E1E1E] border-2 border-[#565d5d] rounded-xl p-4 mb-4 text-center">
                        <p className="text-white">No exercises selected.</p>
                    </div>
                ) : (
                    session.exercises.map((exercise, exerciseIndex) => {
                        return (
                            <CurrentExercise
                                key={exercise.exercise_id}
                                exerciseData={exercise}
                                isExpanded={expandedByExercise[exerciseIndex] || false}
                                onToggle={() => {
                                    const next = [...expandedByExercise];
                                    next[exerciseIndex] = !next[exerciseIndex];
                                    setExpandedByExercise(next);
                                }}
                            />
                        );
                    })
                )}
            </div>
        </>
    );
}
