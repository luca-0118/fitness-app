import {useMutation} from "@tanstack/react-query";
import SessionService from "../../core/features/SessionService.ts";


/**
 * Creates a new session on the backend based on the given workoutId.
 */
export default function useStartWorkout(){
    return useMutation({
        mutationFn: SessionService.startWorkout,
    });
}