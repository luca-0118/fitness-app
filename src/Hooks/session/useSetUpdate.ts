import {useMutation, useQueryClient} from "@tanstack/react-query";
import SessionService from "../../core/features/SessionService.ts";

export default function useSetUpdate() {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: SessionService.updateSet,
        onSuccess: () => {
            // TODO update locally, through entity.
            void queryclient.invalidateQueries({queryKey:["session"]})
        }
    });
}