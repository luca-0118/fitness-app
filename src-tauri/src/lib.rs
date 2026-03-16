use rusqlite::Connection;
use tauri::Manager;
use std::sync::Mutex;
mod get_all_exercises;
mod get_exercise_by_id;
mod get_exercises_by_muscle;

mod api;
mod logic;
mod models;
mod endpoints;
mod services;

struct Db {
    conn: Mutex<Connection>,
}
#[derive(serde::Serialize,serde::Deserialize,Clone)]
pub struct SessionState {
    workout_name: String,
    session_uuid: String,
    start_time: String,
    end_time: String,
    exercises: Vec<SessionExercises>
}

#[derive(serde::Serialize,serde::Deserialize,Clone)]
pub struct SessionExercises {
    exercise_id: String,
    name: String,
    reps: i32,
    weight: i32,
    time_completed: String
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

    // FIXME THIS CONNECTION IS USED BY EVERY SINGLE QUERY. IT ALLOWS US TO EASILY CHANGE QUERIES.
    // IT NEEDS TO BE LIKE THIS TO EASILY CHANGE IT.

    // sets up the default structure of the database.
    

    // Tauri building process
    tauri::Builder::default()
        .setup(|app| {
            // Creates database file in appdata, allows it to be mutable
            let dbpath = services::database::instantiate(app);
            
            //Connects to database.
            let conn = services::database::establish_connection(&dbpath);
            
            // Adds all the required tables.
            services::database::migrate(&conn);

            app.manage(Db {
                conn: Mutex::new(conn),
            });
            
            Ok(())
        })

        //Used for future state management.
        .manage(Mutex::new( SessionState{
            workout_name: String::new(),
            session_uuid: String::new(),
            start_time: String::new(),
            end_time:String::new(),
            exercises: Vec::new(),
        }))


        .plugin(tauri_plugin_opener::init())

        // Add all frontend functions here
        .invoke_handler(tauri::generate_handler![
            endpoints::get_exercise_by_id::return_exercise,
            endpoints::get_all_exercises::get_all_exercises,
            endpoints::workout::get_workout,
            endpoints::workout::create_workout,
            endpoints::workout::list_workouts,
            endpoints::workout::link_exercise,
            endpoints::session::start_session,
            get_exercises_by_muscle::get_exercises_by_muscle,
            endpoints::session::get_session,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn list_workouts(
    db: tauri::State<Db>,
) -> Result<api::ApiResponse<Vec<dto::Workout>>, api::ApiErrorResponse> {
    // Connects conn mutex to this thread.

    let workouts = logic::list_workouts(&db)?;

    Ok(ApiResponse {
        ok: true,
        data: workouts,
    })
}

#[tauri::command]
fn create_workout(
    db: tauri::State<Db>,
    workout: dto::CreateWorkout,
) -> Result<api::ApiResponse<String>, api::ApiErrorResponse> {
    // Early exit if the values are empty.
    // Desc can be empty
    if workout.name.trim().is_empty() {
        return Err(api::ApiError::InvalidInput.into());
    }

    let response = logic::create_workout(&db, workout)?;

    Ok(ApiResponse {
        ok: true,
        data: response.to_string(),
    })
}

#[tauri::command]
fn link_exercise(
    db: tauri::State<Db>,
    link_exercise: dto::LinkExercise,
) -> Result<api::ApiResponse<String>, api::ApiErrorResponse> {
    // checks if both exercise Id and workout Id are given.
    if link_exercise.exercise_uuid.is_empty() || link_exercise.workout_uuid.is_empty() {
        return Err(api::ApiError::InvalidInput.into());
    }

    let resp = logic::link_exercise(&db, link_exercise)?;

    Ok(ApiResponse {
        ok: true,
        data: resp,
    })
}

#[tauri::command]
fn create_exercise(
    db: tauri::State<Db>,
    exercise: dto::CreateExercise,
) -> Result<api::ApiResponse<String>, api::ApiErrorResponse> {
    // Early exit if the values are empty.
    // Desc can be empty
    if exercise.name.trim().is_empty() {
        return Err(api::ApiError::InvalidInput.into());
    }

    logic::create_exercise(&db, exercise)?;

    Ok(ApiResponse {
        ok: true,
        data: "Exercise has been created".to_string(),
    })
}
#[tauri::command]
fn get_workout(
    db: tauri::State<Db>,
    _workout_uuid: String,
) -> Result<api::ApiResponse<dto::IdetailedWorkoutDTO>, api::ApiErrorResponse> {
    let response = logic::get_workout(&db, _workout_uuid)?;

    Ok(ApiResponse {
        ok: true,
        data: response,
    })
}
