import {useQuery} from "@tanstack/react-query";
import SessionService from "../../core/features/SessionService.ts";
import WorkoutSession from "../../core/entities/workout/WorkoutSession.ts";

export default function useSession() {
    return useQuery<WorkoutSession>({
        queryKey:["session"],
        queryFn: SessionService.GetActiveSession
    });
}