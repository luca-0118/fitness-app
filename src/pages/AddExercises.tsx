import ExerciseWidget from "../components/ExerciseWidget.tsx";

export default function AddExercises() { /* mock data, moet uiteindelijk een GET API worden*/
  const exercises = [
      { id: 1, name: "Leg Extension" },
      { id: 2, name: "Barbell press" },
      { id: 3, name: "Deadlift" },
      { id: 4, name: "Rows" },
      { id: 5, name: "Lat Pulldowns" },
      { id: 6, name: "Leg Press" },
      { id: 7, name: "Lunges" },
      { id: 8, name: "Hip Thrusts" },
      { id: 9, name: "Bicep Curls" },
      { id: 10, name: "Pullups" },
  ];

  return (
      <>
        <div>
            {exercises.map((exercise) => (
                <ExerciseWidget key={exercise.id} name={exercise.name} />
            ))}
        </div>
      </>
  );
}