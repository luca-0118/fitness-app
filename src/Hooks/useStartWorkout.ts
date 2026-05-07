import {useMutation} from "@tanstack/react-query";
import SessionService from "../core/features/SessionService.ts";

export default function useStartWorkout(){
    return useMutation({
        mutationFn: SessionService.startWorkout,
    });
}