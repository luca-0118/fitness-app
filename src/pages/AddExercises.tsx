import ExerciseWidget from "../components/ExerciseWidget";
import { useEffect, useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { useNavigate } from "react-router-dom";
import API from "../classes/api";
import SearchBar from "../components/SearchBar";

export default function AddExercises() {
    const [allExercises, setAllExercise] = useState<ExerciseDTO[]>([]);
    const [searchText, setSearchText] = useState("");
    const [activeQuery, setActiveQuery] = useState("");
    const { addExercise } = useWorkout();
    const navigate = useNavigate();

    async function fetchExercises() {
        const result = await API.exercises.list();
        setAllExercise(result);
    }

    useEffect(() => {
        fetchExercises();
    }, []);

    useEffect(() => {
        setActiveQuery(searchText);
    }, [searchText]);

    const filteredExercises = allExercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(activeQuery.toLowerCase()),
    );

    return (
        <>
            <SearchBar
                value={searchText}
                onChange={setSearchText}
                onSearch={() => setActiveQuery(searchText)}
            />
            <div>
                {filteredExercises.map((exercise) => {
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
            </div>
        </>
    );
}
