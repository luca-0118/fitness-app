use std::sync::Mutex;
use tauri::webview::cookie::time::{format_description, UtcDateTime};
use uuid::Uuid;
use crate::{api, services, Db, SessionExercises, SessionState};
use crate::logic;



#[tauri::command]
pub fn start_session(
    session: tauri::State<Mutex<SessionState>>,
    db: tauri::State<Db>,
    workout_id: String,
) -> Result<api::ApiResponse<String>, api::ApiErrorResponse>  {
    let current_workout = logic::workout::detailed(&db, workout_id)?;

    let format_desc = format_description::parse("[year]-[month]-[day] [hour]:[minute]:[second]").expect("Unable to parse format");


    let mut exercises: Vec<SessionExercises> = Vec::new();
    // maps each exercise into a new object we can use during the workout.
    current_workout.exercises.iter().for_each(|exercise| {
        exercises.push(SessionExercises {
            exercise_id: exercise.exercise_id.clone(),
            name: exercise.name.clone(),
            reps: 0,
            weight: 0,
            time_completed: String::new(),
        })
    });

    // creates the session object we keep in memory
    let session_state:  SessionState = SessionState {
        workout_name: current_workout.name.clone(),
        session_uuid: Uuid::new_v4().to_string(),
        start_time: UtcDateTime::now().format(&format_desc).unwrap(),
        end_time: UtcDateTime::now().format(&format_desc).unwrap(),
        exercises,
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
    session: tauri::State<Mutex<SessionState>>
) -> SessionState {
    let session_state = session.lock().unwrap();

    session_state.clone()
}

#[tauri::command]
pub fn complete_session(
    session: tauri::State<Mutex<SessionState>>
) -> Result<api::ApiResponse<SessionState>,api::ApiErrorResponse> {
    let mut session_state = services::session::get(&session);
    session_state.end_time = UtcDateTime::now().to_string();

    services::session::clear(&session);

    Ok(api::ApiResponse { ok: true, data: session_state })
}