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
import lats from "../assets/lats.jpg";
import quads from "../assets/quads.png.jpg";
import shoulders from "../assets/shoulders.png";

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
  }
  async function loadExercises() {
    try {
      const res = await invoke<ExerciseDTO[]>("get_exercises_by_muscle", {
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
    if (muscle === "") return;
    loadExercises();
  }, [muscle]);

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
                [&::-webkit-scrollbar]:bg-neutral-700


                "
        >
          <button className="p-5" onClick={() => setMuscle("pectorals")}>
            <img className="min-w-15 w-15 contain-content" src={chest} alt="" />
          </button>
          <button className="p-5 " onClick={() => setMuscle("biceps")}>
            {" "}
            <img
              className=" min-w-15 w-15 h-15 contain-content"
              src={bicep}
              alt=""
            />
          </button>
          <button className="p-5" onClick={() => setMuscle("triceps")}>
            <img
              className="min-w-15 w-15 contain-content h-15"
              src={tricep}
              alt=""
            />
          </button>
          <button className="p-5" onClick={() => setMuscle("lats")}>
            <img className="min-w-15 w-15 contain-content" src={lats} alt="" />
          </button>
          <button className="p-5" onClick={() => setMuscle("upper back")}>
            <img className="min-w-15 w-15 contain-content" src={back} alt="" />
          </button>
          <button className="p-5" onClick={() => setMuscle("forearms")}>
            <img
              className="min-w-15 w-15 contain-content"
              src={forearms}
              alt=""
            />
          </button>
          <button className="p-5" onClick={() => setMuscle("delts")}>
            <img
              className="min-w-15 w-15 contain-content"
              src={shoulders}
              alt=""
            />
          </button>
          <button className="p-5" onClick={() => setMuscle("abs")}>
            <img className="min-w-15 w-15 contain-content" src={abs} alt="" />
          </button>
          <button className="p-5" onClick={() => setMuscle("glutes")}>
            <img
              className="min-w-15 w-15 contain-content"
              src={glutes}
              alt=""
            />
          </button>
          <button className="p-5" onClick={() => setMuscle("quads")}>
            <img className="min-w-15 w-15 contain-content" src={quads} alt="" />
          </button>
          <button className="p-5" onClick={() => setMuscle("hamstrings")}>
            <img
              className="min-w-15 w-15 contain-content"
              src={hamstrings}
              alt=""
            />
          </button>
          <button className="p-5" onClick={() => setMuscle("calves")}>
            <img
              className="min-w-15 w-15 contain-content"
              src={calves}
              alt=""
            />
          </button>
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
      </div>
    </>
  );
}
