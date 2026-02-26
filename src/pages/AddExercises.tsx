import ExerciseWidget from "../components/ExerciseWidget.tsx";
import SaveIcon from '@mui/icons-material/Save';

export default function Exercises() { /* muk data, moet uiteindelijk een GET API worden*/
    const exercises = [
      { id: 1, name: "Leg Extension" },
      { id: 2, name: "Barbell press" },
      { id: 3, name: "Deadlift" },
      { id: 4, name: "Rows" },
      { id: 5, name: "Lat Pulldowns" },
    ];

  return (
    <>
      <div className="pb-24">
        {exercises.map((exercise) => (
            <ExerciseWidget key={exercise.id} name={exercise.name} />
        ))}
      </div>
      <div>
        <SaveIcon sx={{ fontSize: 40 }}/>
      </div>
    </>
  );
}
