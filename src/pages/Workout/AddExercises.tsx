import { useState, useRef, useEffect } from "react";
import { useWorkout } from "../../context/WorkoutContext.tsx";

import SearchBar from "../../components/General/misc/SearchBar.tsx";

import bicep from "../../assets/biceps.jpg";
import tricep from "../../assets/triceps.jpg";
import chest from "../../assets/chest.jpg";
import abs from "../../assets/abs.png.jpg";
import back from "../../assets/back.png";
import calves from "../../assets/calves.png";
import forearms from "../../assets/forearms.png";
import glutes from "../../assets/glutes.png.jpg";
import hamstrings from "../../assets/hamstrings.png.jpg";
import lats from "../../assets/lats.png";
import quads from "../../assets/quads.png.jpg";
import shoulders from "../../assets/shoulders.png";
import cardio from "../../assets/cardio.png";

import WorkoutFilter from "../../components/Workout/misc/WorkoutFilter.tsx";
import ExerciseAndOverlayItem from "../../components/Workout/listItems/ExerciseAndOverlayItem.tsx";

import UseExerciseList, {
  muscleGroups,
} from "../../Hooks/UseExerciseList.ts";

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
  { gif: cardio, name: "cardiovascular system" },
];

export default function AddExercises() {
  const [searchText, setSearchText] = useState("");

  const {
    setDraftExercises,
    draftSelectedIds,
  } = useWorkout();

  const listRef = useRef<HTMLDivElement>(null);

  const [isScrollTopVisible, setIsScrollTopVisible] =
      useState(false);

  const {
    exercises: apiExercises,
    muscleGroup,
    setMuscle,
    setQuery,
    LoadNextPage,
  } = UseExerciseList();

  const { beginExerciseEdit } = useWorkout();

  useEffect(() => {
    beginExerciseEdit();
  }, []);

  const scrollToTop = () => {
    listRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const listElement = listRef.current;

    const handleScroll = () => {
      if (listElement) {
        setIsScrollTopVisible(
            listElement.scrollTop > 0
        );
      }
    };

    if (listElement) {
      listElement.addEventListener(
          "scroll",
          handleScroll
      );

      return () =>
          listElement.removeEventListener(
              "scroll",
              handleScroll
          );
    }
  }, []);

  return (
      <>
        {/* Pass saveExercises to your header/save button */}
        {/* <SaveButton onSave={saveExercises} /> */}

        <div className="h-screen">
          <div className="fixed top-16 left-0 right-0 z-30 bg-background overflow-hidden">
            <div className="pl-4 pr-4">
              <SearchBar
                  value={searchText}
                  onChange={query => {
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
                  <WorkoutFilter
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
                  className={`text-textcolor w-13 h-13 border border-bordercolor bg-components hover:bg-components-hover rounded-full transition-all duration-100 ease-in-out ${
                      isScrollTopVisible
                          ? "opacity-95 pointer-events-auto"
                          : "opacity-0 pointer-events-none"
                  }`}
              >
                ↑
              </button>
            </div>

            <div
                ref={listRef}
                className="overflow-y-auto overscroll-behavior-y-auto h-[calc(100vh-18rem)] p-4 flex flex-col gap-4"
            >
              {apiExercises.map(exercise => (
                  <ExerciseAndOverlayItem
                      key={exercise.exercise_id}
                      name={exercise.name}
                      gif={exercise.gif_url}
                      id={exercise.exercise_id}
                      selected={draftSelectedIds.has(exercise.exercise_id)}
                      onSelect={() =>
                          setDraftExercises(prev => [
                            ...prev,
                            {
                              id: exercise.exercise_id,
                              name: exercise.name,
                              gif: exercise.gif_url,
                            },
                          ])
                      }
                      onUnselect={() =>
                          setDraftExercises(prev =>
                              prev.filter(ex => ex.id !== exercise.exercise_id)
                          )
                      }
                  />
              ))}

              <div className="px-4">
                <button
                    className="bg-accent hover:bg-accent-action active:bg-accent-action w-full rounded mb-25 text-textcolor"
                    onClick={LoadNextPage}
                >
                  load more
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}