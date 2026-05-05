import { ISessionExercises } from "../../types/types.ts";
import { CompletedExerciseSet } from "../CompletedExerciseSet.tsx";
import {capitalize} from "../../types/Helpers.ts";

interface Props {
    exercise: ISessionExercises;
}

export default function CompletedExercise({ exercise }: Props) {
    return (
        <div className="w-full p-2 bg-components rounded">
            <section className="w-full flex flex-row rounded bg-components-hover">
                <img src={exercise.gif_url} className="h-16 w-16 rounded-l"  alt={"image"}/>
                <h4 className="flex-1 font-SeuratProB text-center self-center text-xl text-textcolor">
                    {capitalize(exercise.name)}
                </h4>
            </section>

            <table className="w-full text-sm">
                <thead>
                {exercise.sets[0].type === "Weighted"  ? (
                    <tr>
                        <th className={"text-end font-BokutohPro py-2 font-medium text-zinc-400 w-12"}>Set</th>
                        <th className={"text-end font-BokutohPro py-2 font-medium text-zinc-400 w-12"}>Reps</th>
                        <th className={"text-end font-BokutohPro py-2 font-medium text-zinc-400 px-4 w-12"}>Weight</th>
                    </tr>
                ) : (
                    <tr>
                        <th className={"text-end font-BokutohPro py-2 font-medium text-zinc-400 w-12"}>Set</th>
                        <th className={"text-end font-BokutohPro py-2 font-medium text-zinc-400 w-12"}>Distance</th>
                        <th className={"text-end font-BokutohPro py-2 font-medium text-zinc-400 px-4 w-12"}>Time</th>
                    </tr>
                )}
                </thead>

                <tbody>
                {exercise.sets.map((set, idx) =>
                    set.type === "Weighted" ? (
                        <CompletedExerciseSet.weighted
                            key={idx}
                            setData={set}
                            setNr={idx + 1}
                        />
                    ) : (
                        <CompletedExerciseSet.timed
                            key={idx}
                            setData={set}
                            setNr={idx + 1}
                        />
                    )
                )}
                </tbody>
            </table>
        </div>
    );
}

