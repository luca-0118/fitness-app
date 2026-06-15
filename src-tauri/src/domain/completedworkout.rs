pub struct CompletedWorkout {
    pub workout_name: String,
    pub session_uuid: String,
    pub start_date: String,
    pub end_date: String,
}

pub type CompletedWorkouts = Vec<CompletedWorkout>;

// ######## For history view ######### //

use crate::domain::{SessionExercise, Set};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct DetailedWorkout {
    pub session_uuid: String,
    pub workout_uuid: String,
    pub workout_name: String,
    pub start_time: String,
    pub end_time: String,
    pub exercises: Vec<CompletedExercise>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CompletedExercise {
    pub exercise_id: String,
    pub completed_id: String,
    pub name: String,
    pub body_part: String,
    pub gif_url: String,
    pub sets: Vec<CompletedSet>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(tag = "type")]
pub enum CompletedSet {
    Weighted { reps: f64, weight: f64 },
    Timed { distance: f64, time: f64 },
}
