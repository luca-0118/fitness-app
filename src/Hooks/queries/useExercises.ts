import {useInfiniteQuery} from "@tanstack/react-query";
import {muscleGroups} from "../../types/types.ts";
import ExerciseService from "../../core/features/ExerciseService.ts";

interface useExercisesProps{
    query?:string,
    filter?:muscleGroups
}

/**
 * Calls all exercises, with automatic ingrained pagination.
 * Returns a list with each list of exercises (per page)
 * so the .data holder a pages[exercises[]]
 */
export default function useExercises({query="row",filter=null}: useExercisesProps) {
    return useInfiniteQuery({queryKey: ["exercises",query,filter],
                    queryFn: async ({pageParam}) => await ExerciseService.getExercises({page:pageParam,page_size:50,query,filter}),
                    initialPageParam: 0,
                    getNextPageParam: (lastPage,pages) => lastPage.length === 50 ? (pages.length || 0) +1 : null // checks if the last page was fully filled.
    });
}