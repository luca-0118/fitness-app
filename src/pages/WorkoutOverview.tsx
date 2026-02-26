import WorkoutWidget from "../components/WorkoutWidget";
import GreenAddButton from "../components/GreenAddButton.tsx";

export default function WorkoutOverview() { /* mock data, moet uiteindelijk een GET API worden*/
  const workouts = [
    { id: 1, name: "Push Day" },
    { id: 2, name: "Pull Day" },
    { id: 3, name: "Leg Day" },
    { id: 4, name: "Upper Body" },
    { id: 5, name: "Lower Body" },
    { id: 6, name: "PR day" },
    { id: 7, name: "Full body" },
    { id: 8, name: "Cardio" },
    { id: 9, name: "Recovery" },
    { id: 10, name: "Glute" },
  ];

  return (
      <div>
        <div className="pb-24 pt-2">
          {workouts.map((workout) => (
            <WorkoutWidget key={workout.id} name={workout.name} />
          ))}
        </div>
        <GreenAddButton to="/new-workout"/>
      </div>
  );
}

