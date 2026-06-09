import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function DetailedHistoryPage() {
    const navigate = useNavigate();

    const handleArrowClick = () => {
        navigate(-1);
    }

    // Test static data which will be replaced by backend functionality.
    const testMap = [
        {
            name: "hi",
            img: "https://placecats.com/64/64",
            sets: [
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                }
            ]
        },
        {
            name: "hi",
            img: "https://placecats.com/64/64",
            sets: [
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                }
            ]
        },
        {
            name: "hi",
            img: "https://placecats.com/64/64",
            sets: [
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                }
            ]
        },
        {
            name: "hi",
            img: "https://placecats.com/64/64",
            sets: [
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                }
            ]
        },
        {
            name: "hi",
            img: "https://placecats.com/64/64",
            sets: [
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                }
            ]
        },
        {
            name: "hi",
            img: "https://placecats.com/64/64",
            sets: [
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                }
            ]
        },
        {
            name: "hi",
            img: "https://placecats.com/64/64",
            sets: [
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                },
                {
                    reps: 10,
                    weight: 110
                }
            ]
        },
    ];

    return (<>
        <div className="absolute top-0 left-0 w-dvw h-dvh bg-background z-100 felx flex-col overflow-auto no-scrollbar">
            <section id="workout-date" className="sticky top-0 bg-components w-full min-h-20 flex flex-col items-center text-xl text-accent py-3 overflow-auto">
                <h1 className="text-3xl font-bold">WorkoutName</h1>
                <p>31-12-1999</p>
                <div className="flex flex-row gap-1">
                    <p>08:30</p>
                    <p>-</p>
                    <p>09:30</p>
                </div>


                <span className='absolute left-2 top-[35%] text-white' onClick={handleArrowClick}>
                    <ArrowBackIcon fontSize="large" />
                </span>
            </section>
            <section id='completed-exercises' className='p-4 flex flex-col gap-4 w-full'>
                {/* Loops through all completed exercises to create new components for each of them */}
                {/* Completed passes on all the data of an completed exercise */}
                {testMap.map(_completed => (<CompletedExercise exerciseInfo={_completed} />))}
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
    exerciseInfo: { name: string, img: string, sets: { reps: number, weight: number }[] }

}
function CompletedExercise({ exerciseInfo }: CompletedExerciseProps) {
    return <article className='bg-components w-full min-h-20 h-fit rounded p-2'>
        <div id="exerciseInfo" className='flex flex-row items-center bg-white/5 rounded'>
            <img src="https://placecats.com/64/64" alt="" />
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
                    <td>{idx}</td>
                    <td>{exercise.reps}</td>
                    <td>{exercise.weight}kg</td>
                </tr>))}
            </tbody>
        </table>
    </article>
}