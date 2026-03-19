import ExerciseWidget from "../components/ExerciseWidget";
import { useEffect, useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { useNavigate } from "react-router-dom";
import API from "../classes/api";
import SearchBar from "../components/SearchBar";
import { invoke } from "@tauri-apps/api/core";
import bicep from "../assets/biceps.jpg";
import tricep from "../assets/triceps.jpg";
import chest from "../assets/chest.jpg";
import abs from "../assets/abs.png.jpg";
import back from "../assets/back.png";
import calves from "../assets/calves.png";
import forearms from "../assets/forearms.png";
import glutes from "../assets/glutes.png.jpg";
import hamstrings from "../assets/hamstrings.png.jpg";
import lats from "../assets/lats.png";
import quads from "../assets/quads.png.jpg";
import shoulders from "../assets/shoulders.png";
import Filter from "../components/Filter";

export default function AddExercises() {
  const [allExercises, setAllExercise] = useState<ExerciseDTO[]>([]);
  const [searchText, setSearchText] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [muscle, setMuscle] = useState<string>("");
  const { addExercise } = useWorkout();
  const navigate = useNavigate();

  async function fetchExercises() {
    const result = await API.exercises.list();
    setAllExercise(result);
    console.log(activeQuery);
  }

  interface ExerciseResponse {
    data: ExerciseDTO[];
    ok: boolean;
  }

  async function loadExercises() {
    try {
      const res = await invoke<ExerciseResponse>("get_exercises_by_muscle", {
        muscle: muscle,
      });
      setAllExercise(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    setActiveQuery(searchText);
  }, [searchText]);

  useEffect(() => {
    if (muscle === "") return;
    loadExercises();
  }, [muscle]);

  const filteredExercises = allExercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(activeQuery.toLowerCase()),
  );

  function handleFilterClick(muscleInput: string) {
    console.log(muscle);
    if (muscle === muscleInput) {
      setMuscle("");
      fetchExercises();
    } else setMuscle(muscleInput);
  }

  return (
    <>
      <SearchBar
        value={searchText}
        onChange={setSearchText}
        onSearch={() => setActiveQuery(searchText)}
      />
      <div>
        <div
          className="overflow-x-scroll flex
                [&::-webkit-scrollbar-thumb]:bg-neutral-500
                [&::-webkit-scrollbar]:bg-neutral-700"
        >
          <Filter
            gif={chest}
            isSelected={muscle === "pectorals"}
            onClick={() => handleFilterClick("pectorals")}
          />

          <Filter
            gif={bicep}
            isSelected={muscle === "biceps"}
            onClick={() => handleFilterClick("biceps")}
          />
          <Filter
            gif={tricep}
            isSelected={muscle === "triceps"}
            onClick={() => handleFilterClick("triceps")}
          />
          <Filter
            gif={lats}
            isSelected={muscle === "lats"}
            onClick={() => handleFilterClick("lats")}
          />
          <Filter
            gif={back}
            isSelected={muscle === "upper back"}
            onClick={() => handleFilterClick("upper back")}
          />
          <Filter
            gif={shoulders}
            isSelected={muscle === "delts"}
            onClick={() => handleFilterClick("delts")}
          />
          <Filter
            gif={forearms}
            isSelected={muscle === "forearms"}
            onClick={() => handleFilterClick("forearms")}
          />
          <Filter
            gif={abs}
            isSelected={muscle === "abs"}
            onClick={() => handleFilterClick("abs")}
          />
          <Filter
            gif={quads}
            isSelected={muscle === "quads"}
            onClick={() => handleFilterClick("quads")}
          />
          <Filter
            gif={hamstrings}
            isSelected={muscle === "hamstrings"}
            onClick={() => handleFilterClick("hamstrings")}
          />
          <Filter
            gif={glutes}
            isSelected={muscle === "glutes"}
            onClick={() => handleFilterClick("glutes")}
          />
          <Filter
            gif={calves}
            isSelected={muscle === "calves"}
            onClick={() => handleFilterClick("calves")}
          />
        </div>
        {filteredExercises.map((exercise) => {
          return (
            <ExerciseWidget
              key={exercise.id}
              name={exercise.name}
              gif={exercise.data}
              onSelect={() => {
                addExercise({
                  id: exercise.id,
                  name: exercise.name,
                  gif: exercise.data,
                });
                navigate(-1);
              }}
            />
          );
        })}
      </div>
    </>
  );
}
