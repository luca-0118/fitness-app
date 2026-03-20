import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CountDownTimer from "../components/CountDownTimer";
import StopWatch from "../components/StopWatch";
import TabataTimer from "../components/TabataTimer";
import {CurrentExercise} from "../components/CurrentExercise.tsx";
import Plusknop from "../components/plusknop.tsx";
import API from "../classes/api.ts";


interface SessionState {
    exercises?: ExerciseDTO[];
}

export default function Session() {
    const navigate = useNavigate();
    const [selectedTimer, setSelectedTimer] = useState("stopwatch");
    const [expandedByExercise, setExpandedByExercise] = useState<boolean[]>([]);
    const [isFinishing, setIsFinishing] = useState(false);
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
                setExpandedByExercise(Array(resp.exercises.length).fill(false));
            }
        }
        getState();

    }, [exercises]);

    const handleAddSet = (exerciseIndex: number) => {
        setSession((prevSession) => {
            if (!prevSession) return prevSession;

            const exercise = prevSession.exercises[exerciseIndex];
            if (!exercise) return prevSession;

            if (exercise.sets.length > 0 && exercise.sets[0].type === "Timed") {
                return prevSession;
            }

            const lastSet = exercise.sets[exercise.sets.length - 1] as IWeightedSet | undefined;
            const newSet: IWeightedSet = lastSet
                ? { ...lastSet }
                : {
                    type: "Weighted",
                    reps: 0,
                    weight: 0,
                    time_completed: new Date().toISOString(),
                };

            const nextExercises = [...prevSession.exercises];
            nextExercises[exerciseIndex] = {
                ...exercise,
                sets: [...exercise.sets, newSet] as IWeightedSet[],
            };

            return {
                ...prevSession,
                exercises: nextExercises,
            };
        });
    };

    const handleDeleteSet = (exerciseIndex: number, setIndex: number) => {
        setSession((prevSession) => {
            if (!prevSession) return prevSession;

            const exercise = prevSession.exercises[exerciseIndex];
            if (!exercise) return prevSession;

            if (exercise.sets.length > 0 && exercise.sets[0].type === "Timed") {
                return prevSession;
            }

            if (exercise.sets.length <= 1) {
                return prevSession;
            }

            const nextExercises = [...prevSession.exercises];
            nextExercises[exerciseIndex] = {
                ...exercise,
                sets: exercise.sets.filter((_, idx) => idx !== setIndex) as IWeightedSet[] | ITimedSet[],
            };

            return {
                ...prevSession,
                exercises: nextExercises,
            };
        });
    };

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

    if (!session) return <h1>Loading....</h1>

    return (
        <>
            <div className="w-full flex flex-col items-center pt-6 pb-44">
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
                        const isCardio = exercise.sets.length > 0 && exercise.sets[0].type === "Timed";

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
                                onDeleteSet={(setIndex) => handleDeleteSet(exerciseIndex, setIndex)}
                            >
                                {!isCardio && (
                                    <Plusknop
                                        onClick={() => handleAddSet(exerciseIndex)}
                                        className="mt-3 w-77 h-12 rounded-full bg-[#2e2e2e] hover:bg-[#3a3a3a]  justify-center transition-colors"
                                        iconSize={32}
                                    />
                                )}
                            </CurrentExercise>
                        );
                    })
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
