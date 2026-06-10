import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import useCompletedSession, { Exercise } from '../../Hooks/UseCompletedSession';
import DbDate from '../../classes/DbDate';

export default function DetailedHistoryPage() {
    const navigate = useNavigate();
    const params = useParams();
    const sessionId = params.workoutId;

    const handleArrowClick = () => {
        navigate(-1);
    }

    const completedSession = useCompletedSession(sessionId ?? "");

    // Test static data which will be replaced by backend functionality.

    if (!completedSession) return <h1>Loading....</h1>

    const startDate = new DbDate(completedSession.start_time);
    const endDate = new DbDate(completedSession.end_time);
    const timeDifference = DbDate.TimeDifference(startDate, endDate);

    console.log(startDate, endDate);



    return (<>
        <div className="absolute top-0 left-0 w-dvw h-dvh bg-background z-100 felx flex-col overflow-auto no-scrollbar">
            <section id="workout-date" className="sticky top-0 bg-components w-full min-h-20 flex flex-col items-center text-xl text-accent py-3 overflow-auto">
                <h1 className="text-3xl font-bold">{completedSession.workout_name}</h1>
                <p>{startDate.toDMY()}</p>
                <div className="flex flex-row gap-1">
                    <p>{startDate.toHS()}</p>
                    <p>-</p>
                    <p>{endDate.toHS()}</p>
                    <p className='text-accent/50'>({timeDifference.hours}h {timeDifference.minutes}m {timeDifference.seconds}s)</p>
                </div>


                <span className='absolute left-2 top-[35%] text-white' onClick={handleArrowClick}>
                    <ArrowBackIcon fontSize="large" />
                </span>
            </section>
            <section id='completed-exercises' className='p-4 flex flex-col gap-4 w-full'>
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
    return <article className='bg-components w-full min-h-20 h-fit rounded p-2'>
        <div id="exerciseInfo" className='flex flex-row gap-2 items-center bg-white/5 rounded'>
            <img src={exerciseInfo.gif_url ?? "https://placecats.com/64/64"} alt="" className='w-16 h-16 rounded-l' />
            <h2 className='text-3xl mx-auto text-accent'>{exerciseInfo.name}</h2>
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