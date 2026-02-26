import WorkoutWidget from "../components/WorkoutWidget";

export default function WorkoutOverview() { /* mock data, moet uiteindelijk een GET API worden*/
  const workouts = [
    { id: 1, name: "Push Day" },
    { id: 2, name: "Pull Day" },
    { id: 3, name: "Leg Day" },
    { id: 4, name: "Upper Body" },
    { id: 5, name: "Lower Body" },
  ];

  return (
      <div className="pb-24">
        {workouts.map((workout) => (
            <WorkoutWidget key={workout.id} name={workout.name} />
        ))}
      </div>
  );
}

