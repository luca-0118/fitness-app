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

#[derive(Serialize, Deserialize, Clone)]
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

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum SetUpdateDTO {
    Weighted {
        exercise_id: String,
        set_nr: usize,
        reps: i64,
        weight: f64,
    },
    Timed {
        exercise_id: String,
        set_nr: usize,
        distance: f64,
        time: f64,
    },
}

impl SetUpdateDTO {
    pub fn apply(self, session_state: &mut models::Session) -> Result<(), api::ApiErrorResponse> {

        // Currently SetUpdateDTO is an enum that can be either be Weighted or Timed.
        match self {
            
            // Weighed variant of setUpdate
            SetUpdateDTO::Weighted { exercise_id, set_nr, reps, weight } => {
                let exercise = session_state
                    .exercises
                    .iter_mut()
                    .find(|e| e.exercise_id == exercise_id)
                    .ok_or(api::ApiError::InvalidInput)?;

                let set = exercise
                    .sets
                    .get_mut(set_nr)
                    .unwrap();

                // ensuring sets are the weighted variant, if it's not we return an error.
                match set {
                    Set::Weighted { reps: r, weight: w, time_completed } => {
                        *r = reps;
                        *w = weight;
                        *time_completed = UtcDateTime::now().to_string();
                    }

                    // Mismatch: trying to update weighted values on a timed set
                    Set::Timed { .. } => {
                        return Err(api::ApiError::InvalidInput.into());
                    }
                }
            }
            // Timed variant of setUpdate
            SetUpdateDTO::Timed { exercise_id, set_nr, distance, time } => {
                let exercise = session_state
                    .exercises
                    .iter_mut()
                    .find(|e| e.exercise_id == exercise_id)
                    .ok_or(api::ApiError::InvalidInput)?;

                let set = exercise
                    .sets
                    .get_mut(set_nr)
                    .unwrap();

                // ensuring sets are the timed variant, if it's not we return an error.
                match set {
                    Set::Timed { distance: d, time: t, time_completed } => {
                        *d = distance;
                        *t = time;
                        *time_completed = UtcDateTime::now().to_string();
                    }

                    // Mismatch: trying to update timed values on a weighted set
                    Set::Weighted { .. } => {
                        return Err(api::ApiError::InvalidInput.into());
                    }
                }
            }
        }
        Ok(())
    }
}