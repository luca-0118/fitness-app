import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import useCompletedSession, { Exercise } from '../../Hooks/UseCompletedSession';
import DbDate from '../../classes/DbDate';

import { ResponsiveContainer, Legend, Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts';
import usePredictNextWorkout from '../../Hooks/UsePredictNextWorkout';
import { useEffect, useState } from 'react';

export default function DetailedHistoryPage() {
    const params = useParams();
    const sessionId = params.workoutId;

    const completedSession = useCompletedSession(sessionId ?? "");

    // Test static data which will be replaced by backend functionality.

    if (!completedSession) return <h1>Loading....</h1>

    const startDate = new DbDate(completedSession.start_time);
    const endDate = new DbDate(completedSession.end_time);
    const timeDifference = DbDate.TimeDifference(startDate, endDate);

    console.log(startDate, endDate);



    return (<>
        <div className="h-full w-full bg-background z-100 felx flex-col overflow-auto no-scrollbar px-4">
            <section id="workout-date" className="sticky top-0 bg-components w-full min-h-20 flex flex-col items-center text-xl text-textcolor py-3 overflow-auto">
                <h1 className="text-3xl">{completedSession.workout_name}</h1>
                <p>{startDate.toDMY()}</p>
                <div className="flex flex-row gap-1">
                    <p>{startDate.toHS()}</p>
                    <p>-</p>
                    <p>{endDate.toHS()}</p>
                    <p className='text-textcolor/50'>({timeDifference.hours}h {timeDifference.minutes}m {timeDifference.seconds}s)</p>
                </div>



            </section>
            <section id='completed-exercises' className='py-4 flex flex-col gap-4 w-full'>
                {/* Loops through all completed exercises to create new components for each of them */}
                {/* Completed passes on all the data of an completed exercise */}
                {completedSession.exercises.map(_completed => (<CompletedExercise exerciseInfo={_completed} />))}
            </section>

        </div>
    </>);
}





///// ######################### /////
/////   Completed Exercise      /////
/////   Component               /////
///// ########################  /////
/**
 * This component is used by the detailed history page to display all the completed exercises of this session.
 * It requires a CompletedExercise Object to properly fill the data.
 */


interface CompletedExerciseProps {
    exerciseInfo: Exercise

}
function CompletedExercise({ exerciseInfo }: CompletedExerciseProps) {
    const plotPoints = usePredictNextWorkout(exerciseInfo.exercise_id);

    const [flipped, setFlipped] = useState<boolean>(false);
    const toggleFlip = () => {
        setFlipped(prev => !prev);
    }

    if (flipped && plotPoints.length > 0)
        return <PredictiveExerciseGraph e1rmList={plotPoints} onclick={toggleFlip} exerciseName={exerciseInfo.name} />

    return <article className='bg-components w-full min-h-20 h-fit rounded-xl p-2 border border-bordercolor' onClick={toggleFlip}>
        <div id="exerciseInfo" className='flex flex-row gap-2 items-center bg-white/5 rounded'>
            <img src={exerciseInfo.gif_url ?? "https://placecats.com/64/64"} alt="" className='w-16 h-16 rounded-l' />
            <h2 className='text-3xl mx-auto text-textcolor'>{exerciseInfo.name}</h2>
        </div>
        <table className='w-full text-textcolor font-normal text-end h-fit'>
            <thead>
                <tr >
                    <th className='pb-2'>set</th>
                    <th className='pb-2'>reps</th>
                    <th className='pb-2'>weight</th>
                </tr>
            </thead>
            <tbody className='text-textcolor/75'>
                {/* Loops through each found from exerciseInfo, and loads the data in the table */}
                {exerciseInfo.sets.map((exercise, idx) => (<tr>
                    <td>{idx + 1}</td>
                    <td>{exercise.reps}</td>
                    <td>{exercise.weight}kg</td>
                </tr>))}
            </tbody>
        </table>
    </article>
}






///// ######################### /////
/////   Predictive Exercise     /////
/////   Component               /////
///// ########################  /////
/**
 * All the interfaces and Component to predict the graph, it also contains some logic to properly graph the points.
 */


interface GraphPoint {
    session: number,
    e1rm: number,
    predicted?: number

}

interface PredictiveExerciseGraphProps {
    e1rmList: number[];
    onclick: () => void;
    exerciseName: string;
}

function PredictiveExerciseGraph({ e1rmList, onclick, exerciseName }: PredictiveExerciseGraphProps) {
    const lastActualIdx = e1rmList.length - 2;

    const graphPoints = e1rmList
        .filter(value => value > 0)
        .map((value, idx, arr) => {
            const isLast = idx === arr.length - 1;
            return {
                session: idx,
                e1rm: isLast ? 0 : value,
                predicted: isLast ? value : 0,
            } as GraphPoint;
        });

    const weightForReps = (e1rm: number, reps: number) => {
        return e1rm / (1 + reps / 30);
    }

    let minValue = 0;

    if (graphPoints.length > 0) {
        // Bridge: last actual point gets predicted = its own e1rm value
        graphPoints[lastActualIdx].predicted = e1rmList[lastActualIdx];

        console.log(graphPoints);

        const values = graphPoints
            .flatMap(p => [p.e1rm, p.predicted])
            .filter((v): v is number => v !== undefined);
        minValue = Math.floor(Math.min(...values) * 0.95); // 5% padding below


    }



    return <>
        <article className='bg-components w-full min-h-20 h-fit rounded-xl border border-bordercolor p-2' onClick={onclick}>
            <h2 className='text-center text-textcolor text-2xl font-bold'>{exerciseName}</h2>
            <p className='text-center text-textcolor text-xl'>Recently completed sessions</p>
            <ResponsiveContainer width={"100%"} height={150}>
                <LineChart data={graphPoints}>
                    <XAxis dataKey="session" />
                    <YAxis domain={[minValue, 'auto']} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="e1rm" stroke="#8884d8" isAnimationActive={false} />
                    <Line type="monotone" dataKey="predicted" stroke="#82ca9d" strokeDasharray="5 5" dot={{ r: 5 }} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
            <p className='text-center text-textcolor'>According to your data, your highest set in your next session should hit <b>{e1rmList[e1rmList.length - 1]} e1RM</b></p>
            <p className='text-center text-textcolor'>This is the same as <b>{weightForReps(e1rmList[e1rmList.length - 1], 10)}kg</b> for <b>10 reps</b></p>
        </article>
    </>
}