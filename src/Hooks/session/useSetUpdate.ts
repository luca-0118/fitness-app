import {useMutation} from "@tanstack/react-query";
import SessionService from "../../core/features/SessionService.ts";

export default function useSetUpdate() {
    return useMutation({
        mutationFn: SessionService.updateSet,
    });
}