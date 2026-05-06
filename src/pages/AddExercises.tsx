import { useState, useRef, useEffect } from "react";
import { useWorkout } from "../context/WorkoutContext";
import SearchBar from "../components/SearchBar";
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
import cardio from "../assets/cardio.png";
import Filter from "../components/Filter";
import SelectedExerciseModal from "../components/SelectedExercisesModal.tsx";
import ExerciseDescriptionOverlay from "../components/ExerciseDescriptionOverlay";
import UseExerciseList, { muscleGroups } from "../Hooks/UseExerciseList.ts";
import useExerciseSelectReducer, { ExercisesActionKind } from "../Hooks/reducers/exerciseSelectReducer.ts";

const muscleFilters: { gif: string; name: muscleGroups }[] = [
  { gif: chest, name: "pectorals" },
  { gif: bicep, name: "biceps" },
  { gif: tricep, name: "triceps" },
  { gif: lats, name: "lats" },
  { gif: back, name: "upper back" },
  { gif: shoulders, name: "delts" },
  { gif: forearms, name: "forearms" },
  { gif: abs, name: "abs" },
  { gif: quads, name: "quads" },
  { gif: hamstrings, name: "hamstrings" },
  { gif: glutes, name: "glutes" },
  { gif: calves, name: "calves" },
  { gif: cardio, name: "cardiovascular system"}
];

export default function AddExercises() {
  const [searchText, setSearchText] = useState("");
  const { addExercise } = useWorkout();
  const listRef = useRef<HTMLDivElement>(null);
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);
  const {state,dispatch} = useExerciseSelectReducer();

  const onSave = () => {
    state.exercises.forEach(exercise => addExercise(exercise));
  }

  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
  };

  useEffect(() => {
    const listElement = listRef.current;
    const handleScroll = () => {
      if (listElement) {
        setIsScrollTopVisible(listElement.scrollTop > 0);
      }
    };

    if (listElement) {
      listElement.addEventListener("scroll", handleScroll);
    }
  }, []);

  const {exercises, muscleGroup,setMuscle,setQuery,LoadNextPage} = UseExerciseList()

  return (
      <>
        <div className="h-screen">
          <div className="fixed top-16 left-0 right-0 z-30 bg-background overflow-hidden">
            <div className="pl-4 pr-4"> 
              <SearchBar
                  value={searchText}
                  onChange={(query) => {
                    setSearchText(query);
                    setQuery(query);
                  }}
                  onSearch={() => {}}
                  placeholderText="exercise"
              />
            </div>
            <div
                className="overflow-x-scroll flex
                  [&::-webkit-scrollbar-thumb]:bg-neutral-500
                  [&::-webkit-scrollbar]:bg-neutral-700"
            >
              {muscleFilters.map(({ gif, name }) => (
                  <Filter
                      key={name}
                      gif={gif}
                      isSelected={muscleGroup === name}
                      onClick={() => {
                        scrollToTop();
                        setMuscle(name);
                      }}
                  />
              ))}
            </div>
            <div className="fixed top-60 right-10 pointer-events-none z-49">
              <button
                  onClick={scrollToTop}
                  className={`text-textcolor w-13 h-13 border border-bordercolor bg-components hover:bg-components-hover rounded-full transition-all duration-100 ease-in-out ${isScrollTopVisible ? "opacity-95 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
              >↑</button>
            </div>
            <div
                ref={listRef}
                className="overflow-y-auto overscroll-behavior-y-auto h-[calc(100vh-18rem)] p-8 flex flex-col gap-4"
            >
              {exercises.map(exercise =>
                  <ExerciseDescriptionOverlay
                      key={exercise.exercise_id}
                      name={exercise.name}
                      gif={exercise.gif_url}
                      id={exercise.exercise_id}
                      selected={false}
                      onSelect={() => {
                        dispatch({
                          type: ExercisesActionKind.SELECT,
                          payload: {
                            id: exercise.exercise_id,
                            gif: exercise.gif_url,
                            name: exercise.name
                          }
                        })
                      }}
                  />)}
              <div className="px-4">
                <button
                    className=" bg-accent hover:bg-accent-action active:bg-accent-action w-full rounded mb-25 text-textcolor"
                    onClick={() => {LoadNextPage()}}>load more</button>
              </div>
            </div>
          </div>
          <SelectedExerciseModal dispatch={dispatch} state={state} saveFunc={onSave}/>
        </div>
      </>
  );
}