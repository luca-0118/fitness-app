use core::error;
use std::sync::Mutex;
use rusqlite::Connection;
use tauri::webview::cookie::time::{UtcDateTime};
use uuid::Uuid;
use crate::{api, services, Db};
use crate::logic;
use crate::models;



#[tauri::command]
pub fn start_session(
    session: tauri::State<Mutex<models::Session>>,
    db: tauri::State<Db>,
    workout_id: String,
) -> Result<api::ApiResponse<String>, api::ApiErrorResponse>  {
    let current_workout = logic::workout::detailed(&db, workout_id)?;


    let mut exercises: Vec<models::SessionExercise> = Vec::new();
    // maps each exercise into a new object we can use during the workout.
    current_workout.exercises.iter().for_each(|exercise| {
        // Creates the three originally default sets
        let mut sets: Vec<models::Set> = Vec::new();
        // #TODO get the total count from new field in database.

        if exercise.body_parts.contains("cardio")
        {
            for _i in 0..1 {
                sets.push(models::Set::Timed{
                    distance: 0f64,
                    time: 0.0,
                    time_completed: String::new()
                });
            }
        } else {
            for _i in 0..3 {
                sets.push(models::Set::Weighted{
                    reps: 0,
                    weight:0.0,
                    time_completed: String::new()
                });
            }
        }

        // adds the exercise to the sessionExercises
        exercises.push(models::SessionExercise {
            exercise_id: exercise.exercise_id.clone(),
            name: exercise.name.clone(),
            gif_url: exercise.gif_url.clone(),
            sets
        });
    });

    // creates the session object we keep in memory
    let session_state:  models::Session = models::Session{
        session_uuid: Uuid::new_v4().to_string(),
        workout_uuid: current_workout.uuid.clone(),
        workout_name: current_workout.name.clone(),
        start_time: UtcDateTime::now().to_string(),
        end_time: String::new(),
        exercises
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
) -> Result<api::ApiResponse<models::Session>,api::ApiErrorResponse> {
    let session_state = session.lock().unwrap();

    Ok(api::ApiResponse {
        ok: true,
        data: session_state.clone()
    })
}



#[tauri::command]
pub fn update_set(
    session: tauri::State<Mutex<models::Session>>,
    set_update: models::SetUpdateDTO,
) -> Result<api::ApiResponse<String>,api::ApiErrorResponse>
{
    let mut session_state = session.lock().unwrap();

    set_update.apply(&mut session_state)?;

    // returns positive response
    Ok(api::ApiResponse {
        ok: true,
        data: "set has been updated successfully".to_string()
    })
}

#[tauri::command]
pub fn complete_session(
    session: tauri::State<Mutex<models::Session>>,
    db: tauri::State<Db>
) -> Result<api::ApiResponse<models::Session>,api::ApiErrorResponse> {
    let mut db_guard = db.conn.lock().unwrap();
    let conn: &mut Connection = &mut db_guard;

    // Get the current session state object
    let mut session_state = services::session::get(&session);
    session_state.end_time = UtcDateTime::now().to_string();

    // Removes the session from memory.
    services::session::clear(&session);

    //creates an dto for the function and sends it.
    let workout_dto = logic::session::CompletedWorkoutDTO{
        session_id: session_state.session_uuid.clone(),
        workout_id: session_state.workout_uuid.clone(),
        started_at: session_state.start_time.clone(),
        completed_at: session_state.end_time.clone()
    };
    let completed = logic::session::add_completed_workout(conn, workout_dto);
    if !completed {
        println!("Error while creating workout");
        return Err(api::ApiError::DatabaseError.into());
    }


    logic::session::add_completed_exercises(conn,&session_state.exercises,&session_state.session_uuid);


    Ok(api::ApiResponse { ok: true, data: session_state })
}