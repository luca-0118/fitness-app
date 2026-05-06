pub struct CompletedWorkout {
    pub workout_name: String,
    pub session_uuid: String,
    pub start_date: String,
    pub end_date: String,
}

pub type CompletedWorkouts = Vec<CompletedWorkout>;
