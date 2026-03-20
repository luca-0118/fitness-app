use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
    pub struct Workout {
        pub uuid: String,
        pub name: String,
        pub desc: Option<String>,
    }

#[derive(Debug, Serialize, Deserialize)]
pub struct WorkoutHistory {
    pub workout_name:    String,
    pub session_uuid:    String,
    pub start_date:      String,
    pub end_date:        String,
}

pub type IWorkoutHistory = Vec<WorkoutHistory>;