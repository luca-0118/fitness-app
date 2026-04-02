use serde::{Deserialize, Serialize};

#[derive(Serialize,Deserialize,Clone)]
pub struct Session {
    pub session_uuid: String,
    pub workout_uuid: String,
    pub workout_name: String,
    pub start_time: String,
    pub end_time: String,
    pub exercises: Vec<SessionExercise>
}

#[derive(Serialize,Deserialize,Clone)]
pub struct SessionExercise {
    pub exercise_id: String,
    pub name: String,
    pub gif_url: String,
    pub sets: Vec<Set>
}

#[derive(Debug, Serialize, Deserialize,Clone)]
#[serde(tag = "type")]
pub enum Set {
    Weighted {
        reps: i64,
        weight: f64,
        time_completed: String,
    },
    Timed {
        distance: f64,
        time: f64,
        time_completed: String,
    },
}
