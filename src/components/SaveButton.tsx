import SaveIcon from '@mui/icons-material/Save';
import API from '../classes/api';
import { useWorkout } from '../context/WorkoutContext';

export default function SaveButton() {
    const { workoutName } = useWorkout();

    function handleSave() {
        API.workouts.create(workoutName).then((resp) => {
            console.log(resp);
        })
    }

    return (
        <div className="relative">
            <button onClick={handleSave} className="cursor-pointer">
                <SaveIcon sx={{ fontSize: 40 }}/>
            </button>
        </div>
    );
}