import ExerciseWidget from "../components/ExerciseWidget";
import { useEffect, useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { useNavigate } from "react-router-dom";
import API from "../classes/api";
import { invoke } from "@tauri-apps/api/core";
import bicep from "../assets/biceps.jpg"
import tricep from "../assets/triceps.jpg"
import chest from "../assets/chest.jpg"


export default function AddExercises() {
    const [allExercises, setAllExercise] = useState<ExerciseDTO[]>([]);
    const [muscle, setMuscle] = useState<string>("")
    const { addExercise } = useWorkout();
    const navigate = useNavigate();

    async function fetchExercises() {
        const result = await API.exercises.list();
        setAllExercise(result);
    }
    async function loadExercises() {
        try {
            const res = await invoke<ExerciseDTO[]>("get_exercises_by_muscle", {
                muscle: muscle
            });
            setAllExercise(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchExercises()
    }, []);


    useEffect(() => {
        if (muscle === "") return;
        loadExercises();
    }, [muscle])

    return (
        <>
            <div>
                <div className="overflow-x-scroll flex
                [&::-webkit-scrollbar-thumb]:bg-neutral-500
                [&::-webkit-scrollbar]:bg-neutral-700


                "
                >

                    <button className="p-5 " onClick={() => setMuscle("biceps")}> <img className=" min-w-15 w-15 h-15 contain-content" src={bicep} alt="" /></button>
                    <button className="p-5" onClick={() => setMuscle("triceps")}><img className="min-w-15 w-15 contain-content h-15" src={tricep} alt="" /></button>
                    <button className="p-5" onClick={() => setMuscle("pectorals")}><img className="min-w-15 w-15 contain-content" src={chest} alt="" /></button>
                    <button className="p-5" onClick={() => setMuscle("traps")}><img className="min-w-15 w-15 contain-content" src={chest} alt="" /></button>
                    <button className="p-5" onClick={() => setMuscle("glutes")}><img className="min-w-15 w-15 contain-content" src={chest} alt="" /></button>
                    <button className="p-5" onClick={() => setMuscle("abs")}><img className="min-w-15 w-15 contain-content" src={chest} alt="" /></button>
                    <button className="p-5" onClick={() => setMuscle("forearms")}><img className="min-w-15 w-15 contain-content" src={chest} alt="" /></button>
                    <button className="p-5" onClick={() => setMuscle("lats")}><img className="min-w-15 w-15 contain-content" src={chest} alt="" /></button>
                    <button className="p-5" onClick={() => setMuscle("quads")}><img className="min-w-15 w-15 contain-content" src={chest} alt="" /></button>
                    <button className="p-5" onClick={() => setMuscle("delts")}><img className="min-w-15 w-15 contain-content" src={chest} alt="" /></button>
                    <button className="p-5" onClick={() => setMuscle("abductors")}><img className="min-w-15 w-15 contain-content" src={chest} alt="" /></button>
                    <button className="p-5" onClick={() => setMuscle("calves")}><img className="min-w-15 w-15 contain-content" src={chest} alt="" /></button>
                    <button className="p-5" onClick={() => setMuscle("upper back")}><img className="min-w-15 w-15 contain-content" src={chest} alt="" /></button>
                    <button className="p-5" onClick={() => setMuscle("hamstrings")}><img className="min-w-15 w-15 contain-content" src={chest} alt="" /></button>
                    <button className="p-5" onClick={() => setMuscle("adductors")}><img className="min-w-15 w-15 contain-content" src={chest} alt="" /></button>
                </div>
                {allExercises.map((exercise) => {
                    return (
                        <ExerciseWidget
                            key={exercise.id}
                            name={exercise.name}
                            gif={exercise.data}
                            onSelect={() => {
                                addExercise({ id: exercise.id, name: exercise.name });
                                navigate(-1);
                            }}
                        />
                    );
                })}
            </div >
        </>
    );
}
