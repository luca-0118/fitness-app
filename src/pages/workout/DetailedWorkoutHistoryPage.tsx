import {useParams} from "react-router-dom";
import {useEffect} from "react";
import API from "../../classes/api.ts";

export default function DetailedWorkoutHistoryPage() {
    const params = useParams();
    const id = params.id ?? "";

    useEffect(() => {
        const fetech = async () => {
            const resp = await API.workouts.historyDetails(id);
            console.log(resp);
        };

        void fetech();
    }, [id]);


    return<div className={"flex w-full h-full flex-col p-4 overflow-y-scroll no-scrollbar"}>{id}</div>
}