import {useState, useEffect, useMemo} from "react";
import SearchBar from "../../components/SearchBar.tsx";
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
import Filter from "../../components/Filter.tsx";
import ExerciseItem from "../../components/listItems/ExerciseItem.tsx";
import {ExerciseDTO, muscleGroups} from "../../types/types.ts";
import useExercises from "../../Hooks/queries/useExercises.ts";
import ExerciseItemSkeleton from "../../components/skeletons/ExerciseItemSkeleton.tsx";
import {useOutletContext} from "react-router-dom";
import {WorkoutOutletContext} from "../../components/routers/WorkoutRoutes.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import {InfiniteData, UseInfiniteQueryResult} from "@tanstack/react-query";
import {useDebounce} from "../../Hooks/useDebounce.ts";
import useScroll from "../../Hooks/useScroll.ts";

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

export default function ExerciseOverviewPage() {
  //   NOTE, we reset the scroll in WorkoutRoutes.tsx.
  //   So that the next time you make a workout, it doesn't start halfway instantly.
  const {scrollFunc,scrollRef,saveScroll,restoreScroll} = useScroll("exerciseScrollSaver");

  const [query,setQuery] = useState<string>("");
  const [filter,setFilter] = useState<muscleGroups>(null);
  const debouncedQuery = useDebounce(query);

  const exercises = useExercises({query:debouncedQuery,filter});
  const {tempWorkout} = useOutletContext<WorkoutOutletContext>();
  const addedExerciseIds = useMemo(() => {
      return tempWorkout.exercises.map(exercises => exercises.id);
  },[tempWorkout]);

    // Loads the next page with exercises.
    const nextPage = () => {
        void exercises.fetchNextPage();
    }

    // This useEffect restores the scroll when coming back from any page
    useEffect(() => {
        if (exercises.isSuccess) {
            // if we don't use it, it don't work.
            // it waits until the next render before firing function.
            requestAnimationFrame(() => restoreScroll());
        }
    }, []);

    // Scrolls back to top whenever we search or filter.
    useEffect(() => {
    scrollFunc();
    },[debouncedQuery,filter]);


    /**
     * an list of the filter elements.
     * @constructor
     */
  const MuscleFilterRow = () => {
    return muscleFilters.map(({ gif, name }) => (
        <Filter
            key={name}
            gif={gif}
            isSelected={filter==name}
            onClick={() => {
              if(filter==name) return setFilter(null);
              return setFilter(name);
            }}
        />
    ));
  }

  return <div className={"h-full flex flex-col p-4 bg-background"}>
      <SearchBar onSearch={()=>{}} placeholderText={"Search exercises"} value={query} onChange={e => {
        setQuery(e);
      }}/>
      <div className={"flex shrink-0 overflow-y-hidden overflow-x-auto [&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar]:bg-neutral-700 mb-4"}>
        <MuscleFilterRow/>
      </div>
      {/*Some bullshit workaround yippie.*/}
      <ul ref={scrollRef as React.RefObject<HTMLUListElement>} className={"h-full overflow-y-scroll flex flex-col gap-4 no-scrollbar pb-4"}>

        {/*The list of all exercises.*/}
        <ExerciseItemList exercises={exercises} tempList={addedExerciseIds} onItemNavigate={saveScroll}/>

        {/*Shows the load more button, if there are more pages.*/}
        {exercises.hasNextPage ?
          <PrimaryButton onClick={nextPage}><p className={"w-full h-full text-center p-4 block"}>Load more</p></PrimaryButton>
        :null}
      </ul>
  </div>
}



interface ExerciseItemListProps {
  exercises: UseInfiniteQueryResult<InfiniteData<ExerciseDTO[], unknown>, Error>
  tempList: string[]
  onItemNavigate: () => void
}

/**
 * Generates the itemList based on the current state of the queries and the tempList of id's given.
 * Handles the list loading
 *
 * If it's still loading, show skeletons
 *
 * if an error, or no data, return an error
 *
 * otherwise return a list of ExerciseItem Components.
 * @param param0.exercises the useExercises query
 * @param param0.tempList a list of id's from each exercise that are already added to the placehold workout.
 * @param param0.onItemNavigate a function we drill down for when the item navigates
 * @constructor
 */
function ExerciseItemList({exercises,tempList,onItemNavigate}:ExerciseItemListProps) {
  if (exercises.isLoading)
    return Array.from({ length: 6 }, (_, i) => <ExerciseItemSkeleton key={i} />);

  if (exercises.isError || !exercises.data)
    return <h1>Error: {exercises?.error?.message ?? "no data"}</h1>;

  return exercises.data.pages.flatMap((exercisePage) =>
      exercisePage.map((exercise) => (
          <ExerciseItem
              key={exercise.exercise_id}
              id={exercise.exercise_id}
              name={exercise.name}
              gif={exercise.gif_url}
              selected={tempList.includes(exercise.exercise_id)}
              onNavigate={onItemNavigate}
          />
      ))
  );
};