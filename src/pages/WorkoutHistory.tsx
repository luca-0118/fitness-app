import WorkoutHistoryWidget from "../components/WorkoutHistoryWidget.tsx";

export default function WorkoutHistory() {
    const workoutHistory = [
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
                {workoutHistory.map((workoutHistory) => (
                    <WorkoutHistoryWidget key={workoutHistory.id} name={workoutHistory.name} />
                ))}
            </div>
        </div>
  );
}
