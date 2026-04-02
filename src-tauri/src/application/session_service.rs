use serde::{Deserialize, Serialize};
use tauri::webview::cookie::time::UtcDateTime;
use uuid::Uuid;
use crate::api::{ApiError, ApiErrorResponse};
use crate::domain::{AddExerciseParams, AddTimedSetParams, AddWeighedSetParams, CompletedExerciseRepo, CompletedWorkouts, SaveSessionParams, Session, SessionExercise, Set, WorkoutExerciseRepo, WorkoutHistoryRepo};
use crate::repository::completed_exercise_repository::CompletedExerciseRepository;
use crate::repository::workout_exercise_repository::WorkoutExerciseRepository;
use crate::repository::workout_history_repository::WorkoutHistoryRepository;

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum UpdateSessionSetRequest {
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

impl UpdateSessionSetRequest {
    pub fn apply(self, session: &mut Session) -> Result<(), ApiErrorResponse> {
        //TODO implement this for adding new rows of sets too.
        match self {
            UpdateSessionSetRequest::Weighted { exercise_id, set_nr, reps, weight } => {
                let set = get_exercise_set(session, exercise_id, set_nr)?;
                match set {
                    Set::Weighted { reps: r, weight: w, time_completed } => {
                        *r = reps;
                        *w = weight;
                        *time_completed = UtcDateTime::now().to_string();
                    }

                    // Mismatch: trying to update weighted values on a timed set
                    Set::Timed { .. } => {
                        return Err(ApiError::InvalidInput.into());
                    }
                }
            },
            UpdateSessionSetRequest::Timed { exercise_id, set_nr, distance, time } => {
                let set = get_exercise_set(session, exercise_id, set_nr)?;

                match set {
                    Set::Timed { distance: d, time: t, time_completed } => {
                        *d = distance;
                        *t = time;
                        *time_completed = UtcDateTime::now().to_string();
                    }

                    // Mismatch: trying to update timed values on a weighted set
                    Set::Weighted { .. } => {
                        return Err(ApiError::InvalidInput.into());
                    }
                }
            }
        }
        Ok(())
    }
}

fn get_exercise_set(session: &mut Session, exercise_id: String, set_nr: usize) -> Result<&mut Set, ApiErrorResponse> {
    let exercise = session
        .exercises
        .iter_mut()
        .find(|e| e.exercise_id == exercise_id)
        .ok_or(ApiError::InvalidInput)?;

    let set = exercise
        .sets
        .get_mut(set_nr)
        .ok_or(ApiError::InvalidInput)?;

    Ok(set)
}

pub struct SessionService {
    current_session: Option<Session>,
    workout_exercise: WorkoutExerciseRepository,
    workout_history: WorkoutHistoryRepository,
    completed_exercise: CompletedExerciseRepository
}

impl SessionService {
    pub fn new(workout_exercise: WorkoutExerciseRepository, workout_history: WorkoutHistoryRepository,completed_exercise:CompletedExerciseRepository) -> Self {
        Self{
            current_session: None,
            workout_exercise,
            workout_history,
            completed_exercise
        }
    }

    pub fn workout_history(&self) -> Result<CompletedWorkouts,ApiErrorResponse> {
        let workout_history = self
            .workout_history
            .get_history()
            .map_err(|_| ApiError::DatabaseError)?;
        
        Ok(workout_history)
    }

    pub fn save_session(&mut self) -> Result<String,ApiErrorResponse> {
        let session = self.current_session.clone().ok_or(ApiError::SessionNotFound)?;

        //Creating the required SaveSessionParams for the add function.
        self.workout_history.add(SaveSessionParams {
            session_id: session.session_uuid.clone(),
            workout_id: session.workout_uuid,
            started_at: session.start_time,
            completed_at: UtcDateTime::now().to_string()
        })
            .map_err(|_| ApiError::SessionNotSaved)?;

        // Looping through each exercise to add it's completed version to the database.
        for exercise in session.exercises.iter() {

            //Creating the required AddExerciseParams struct for the add_exercise function.
            let exercise_id = self.completed_exercise.add_exercise(AddExerciseParams {
                exercise_id: exercise.exercise_id.clone(),
                session_id: session.session_uuid.clone()
            })
                .map_err(|e| {
                    println!("Error adding exercise {}", e);
                    ApiError::ExerciseNotSaved
                })?;

            for set in exercise.sets.iter() {
                match set {
                    Set::Weighted { reps, weight, time_completed } => {
                        self.completed_exercise.add_weighted_set(AddWeighedSetParams {
                            completed_exercise_id: exercise_id.clone(),
                            reps: *reps,
                            weight: *weight,
                            time_completed: time_completed.clone(),
                        })
                    }
                    Set::Timed { distance, time, time_completed } => {
                        self.completed_exercise.add_timed_set(AddTimedSetParams{
                            completed_exercise_id: exercise_id.clone(),
                            distance: *distance,
                            time: *time,
                            time_completed: time_completed.clone(),
                        })
                    }
                }.map_err(|e| {
                    println!("{:?}", e);
                    ApiError::SetNotSaved
                })?;
            }

        }

        Ok("Workout has been saved.".to_string())
    }

    // gets the currently active session and updates it using the UpdateSessionSetRequest.
    pub fn update_session_set(&mut self, set_update: UpdateSessionSetRequest) -> Result<String,ApiErrorResponse> {
        let mut session = self.current_session.clone().ok_or(ApiError::SessionNotFound)?;

        //applies the set onto the session

        set_update.apply(&mut session)?;

        // sets the copied session(with updates) back into memory
        self.current_session = Some(session);

        //Tells us we updated
        Ok("updated".to_string())
    }

    pub fn get_session(&self) -> Option<Session> {
        self.current_session.clone()
    }

    pub fn start_session(&mut self, workout_id: String) -> Result<String,ApiErrorResponse> {
        //gets detailed workout
        let workout_details = self.workout_exercise.get_detailed(&workout_id).map_err(|_|ApiError::DatabaseError)?;

        // map exercises to vector of sessionExercises
        let session_exercises = workout_details
            .exercises
            .into_iter()
            .map(|exercise| {
            SessionExercise {
                exercise_id: exercise.exercise_id,
                name: exercise.name,
                gif_url:exercise.gif_url,
                sets: instantiate_sets(exercise.body_parts)
            }
        }).collect();

        // create new SessionObject
        let session_uuid = Uuid::new_v4().to_string();
        let session = Session{
            session_uuid: session_uuid.clone(),
            workout_uuid: workout_details.uuid,
            workout_name: workout_details.name,
            start_time:  UtcDateTime::now().to_string(),
            end_time: String::new(),
            exercises: session_exercises
        };

        // set new Session Object
        self.current_session = Some(session);

        // return session_uuid
        Ok(session_uuid)
    }
}

fn instantiate_sets(body_part: String) -> Vec<Set> {
    let mut sets: Vec<Set> = Vec::new();
    // #TODO get the total count from new field in database.

    if body_part.contains("cardio")
    {
        for _i in 0..1 {
            sets.push(Set::Timed {
                distance: 0f64,
                time: 0.0,
                time_completed: String::new()
            });
        }
    } else {
        for _i in 0..3 {
            sets.push(Set::Weighted {
                reps: 0,
                weight: 0.0,
                time_completed: String::new()
            });
        }
    }

    sets
}