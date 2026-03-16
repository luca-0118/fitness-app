use serde::{Deserialize, Serialize};
use tauri::webview::cookie::time::UtcDateTime;
use crate::{api, models};

#[derive(Serialize,Deserialize,Clone)]
pub struct Session {
    pub session_uuid: String,
    pub workout_uuid: String,
    pub workout_name: String,
    pub start_time: String,
    pub end_time: String,
    pub exercises: Vec<Exercise>
}

#[derive(Serialize,Deserialize,Clone)]
pub struct Exercise {
    pub exercise_id: String,
    pub gif_url: String,
    pub name: String,
    pub sets: Vec<Set>,
}

#[derive(Serialize,Deserialize,Clone)]
pub struct Set {
    pub reps: i32,
    pub weight: f32,
    pub time_completed: String
}