import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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

function getExerciseType(exercise: ExerciseDTO): "cardio" | "weight" {
    const targetMuscles = (exercise as ExerciseDTO & {
        target_muscles?: string;
        targetMuscles?: string;
    }).target_muscles || (exercise as ExerciseDTO & { targetMuscles?: string }).targetMuscles;

    if (typeof targetMuscles === "string") {
        const normalizedTargetMuscles = targetMuscles
            .toLowerCase()
            .replace(/[\[\]"]/g, "")
            .trim();

        if (normalizedTargetMuscles.startsWith("cardio")) {
            return "cardio";
        }
    }

    const exerciseType = (exercise as ExerciseDTO & { exerciseType?: string }).exerciseType;
    if (typeof exerciseType === "string" && exerciseType.toLowerCase() === "cardio") {
        return "cardio";
    }

    return "weight";
}

export default function Session() {
    const [selectedTimer, setSelectedTimer] = useState("stopwatch");
    const [numSetsByExercise, setNumSetsByExercise] = useState<number[]>([]);
    const [expandedByExercise, setExpandedByExercise] = useState<boolean[]>([]);
    const location = useLocation();
    const state = location.state as SessionState | null;
    const exercises = state?.exercises || [];

    useEffect(() => {
        setNumSetsByExercise(
            exercises.map((exercise) =>
                getExerciseType(exercise) === "cardio" ? 1 : 3,
            ),
        );
        setExpandedByExercise(Array(exercises.length).fill(false));

        const getState = async () => {
            const resp = await API.session.get();
            console.log(resp);
        }
        getState();

    }, [exercises]);

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
                    exercises.map((exercise, exerciseIndex) => {
                        const exerciseType = getExerciseType(exercise);
                        const setCount = exerciseType === "cardio" ? 1 : (numSetsByExercise[exerciseIndex] || 3);

                        return (
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
                                    { length: setCount },
                                    (_, setIndex) => (
                                        <Sets
                                            key={setIndex + 1}
                                            setNumber={setIndex + 1}
                                            exerciseType={exerciseType}
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

                                {exerciseType !== "cardio" && (
                                    <Plusknop
                                        onClick={() => {
                                            const next = [...numSetsByExercise];
                                            next[exerciseIndex] =
                                                (next[exerciseIndex] || 3) + 1;
                                            setNumSetsByExercise(next);
                                        }}
                                        className="mt-3 w-77 h-12 rounded-full bg-[#2e2e2e] hover:bg-[#3a3a3a] active:bg-[#3a3a3a] justify-center transition-colors"
                                        iconSize={32}
                                    />
                                )}
                            </CurrentExercise>
                        );
                    })
                )}
            </div>
        </>
    );
}
