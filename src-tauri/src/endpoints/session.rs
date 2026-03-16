use std::collections::btree_map::Range;
use std::sync::Mutex;
use serde::{Deserialize, Serialize};
use tauri::webview::cookie::time::{format_description, UtcDateTime};
use uuid::Uuid;
use crate::{api, services, Db, SessionExercises, SessionState};
use crate::logic;
use crate::models;



#[tauri::command]
pub fn start_session(
    session: tauri::State<Mutex<models::Session>>,
    db: tauri::State<Db>,
    workout_id: String,
) -> Result<api::ApiResponse<String>, api::ApiErrorResponse>  {
    let current_workout = logic::workout::detailed(&db, workout_id)?;

    let format_desc = format_description::parse("[year]-[month]-[day] [hour]:[minute]:[second]").expect("Unable to parse format");


    let mut exercises: Vec<models::SessionExercise> = Vec::new();
    // maps each exercise into a new object we can use during the workout.
    current_workout.exercises.iter().for_each(|exercise| {
        // Creates the three originally default sets
        let mut sets: Vec<models::Set> = Vec::new();
        // #TODO get the total count from new field in database.
        for i in 0..3 {
            sets.push(models::Set{
                reps: 0,
                weight:0.0,
                time_completed: String::new()
            });
        }

        // adds the exercise to the sessionExercises
        exercises.push(models::SessionExercise {
            exercise_id: exercise.exercise_id.clone(),
            name: exercise.name.clone(),
            gif_url: exercise.gif_url.clone(),
            sets: sets
        });
    });

    // creates the session object we keep in memory
    let session_state:  models::Session = models::Session{
        session_uuid: Uuid::new_v4().to_string(),
        workout_uuid: current_workout.uuid.clone(),
        workout_name: current_workout.name.clone(),
        start_time: UtcDateTime::now().to_string(),
        end_time: String::new(),
        exercises: exercises
    };

    // adds the session to our active memory.
    services::session::start(&session_state, &session);

    Ok(api::ApiResponse {
        ok: true,
        data: session_state.session_uuid
    })
}

#[tauri::command]
pub fn get_session(
    session: tauri::State<Mutex<models::Session>>
) -> Result<ApiResponse<models::Session>,api::ApiErrorResponse> {
    let session_state = session.lock().unwrap();

    Ok(api::ApiResponse {
        ok: true,
        data: session_state.clone()
    })
}


#[derive(Debug,Serialize,Deserialize)]
pub struct SetUpdateDTO {
    pub exercise_id: String,
    pub set_nr: usize,
    pub reps: i32,
    pub weight: f32,
}
#[tauri::command]
pub fn update_set(
    session: tauri::State<Mutex<models::Session>>,
    set_update: SetUpdateDTO,
) -> Result<ApiResponse<String>,api::ApiErrorResponse>
{
    let mut session_state = session.lock().unwrap();

    // Gets the given exercise
    let exercise = session_state
        .exercises
        .iter_mut()
        .find(|e| e.exercise_id == set_update.exercise_id)
        .unwrap();

    // Finds the specific set
    let set = exercise
        .sets
        .get_mut(set_update.set_nr)
        .unwrap();

    // Updates the set data.
    set.reps = set_update.reps;
    set.weight = set_update.weight;
    set.time_completed = UtcDateTime::now().to_string();

    // returns positive response
    Ok(api::ApiResponse {
        ok: true,
        data: "set has been updated successfully".to_string()
    })
}

#[tauri::command]
pub fn complete_session(
    session: tauri::State<Mutex<models::Session>>,
    db: tauri::State<Mutex<Db>>
) -> Result<api::ApiResponse<models::Session>,api::ApiErrorResponse> {
    let db = db.lock().unwrap();

    // Get the current session state object
    let mut session_state = services::session::get(&session);
    session_state.end_time = UtcDateTime::now().to_string();

    // Removes the session from memory.
    services::session::clear(&session);

    //creates an dto for the function and sends it.
    let workout_dto = logic::session::CompletedWorkoutDTO{
        session_id: session_state.session_uuid,
        started_at: session_state.start_time,
        completed_at: session_state.end_time
    };
    logic::session::add_completed_workout(&db, workout_dto);


    // logic::session::add_completed_exercises(&db,)


    Ok(api::ApiResponse { ok: true, data: session_state })
}

#[tauri::command]
pub fn complete_session(
    session: tauri::State<Mutex<models::Session>>,
    db: tauri::State<Mutex<Db>>
) -> Result<api::ApiResponse<models::Session>,api::ApiErrorResponse> {
    let db = db.lock().unwrap();

    // Get the current session state object
    let mut session_state = services::session::get(&session);
    session_state.end_time = UtcDateTime::now().to_string();

    // Removes the session from memory.
    services::session::clear(&session);

    //creates an dto for the function and sends it.
    let workout_dto = logic::session::CompletedWorkoutDTO{
        session_id: session_state.session_uuid,
        started_at: session_state.start_time,
        completed_at: session_state.end_time
    };
    logic::session::add_completed_workout(&db, workout_dto);


    // logic::session::add_completed_exercises(&db,)


    Ok(api::ApiResponse { ok: true, data: session_state })
}