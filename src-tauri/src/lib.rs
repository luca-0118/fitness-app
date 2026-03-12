use rusqlite::Connection;
use std::sync::Mutex;
mod get_all_exercises;
mod get_exercise_by_id;
mod get_exercises_by_muscle;

use crate::api::ApiResponse;
mod api;
mod dto;
mod logic;
struct Db {
    conn: Mutex<Connection>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

    // FIXME THIS CONNECTION IS USED BY EVERY SINGLE QUERY. IT ALLOWS US TO EASILY CHANGE QUERIES.
    // IT NEEDS TO BE LIKE THIS TO EASILY CHANGE IT.
    let conn = Connection::open("../public/workoutbase.sqlite")
        .expect("Failed to open or create database");

    conn.execute("DROP TABLE IF EXISTS WorkoutExercises", [])
        .expect("failed to drop table WorkoutExercises");

    // Workout table
    conn.execute("DROP TABLE IF EXISTS Workouts", [])
        .expect("failed to drop table Workouts)");

    conn.execute(
        "CREATE TABLE Workouts (
            ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            Uuid TEXT NOT NULL,
            Name TEXT NOT NULL,
            Desc TEXT
            );",
        [],
    )
    .expect("failed to initialize schema Workouts");

    //Workout exercises table
    // NOTE PRAGMA foreign_keys = ON; is required, otherwise foreign keys won't work.
    conn.execute("PRAGMA foreign_keys = ON", [])
        .expect("foreign keys disabled");

    conn.execute(
        "CREATE TABLE WorkoutExercises (
            ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            WorkoutId INTEGER NOT NULL,
            ExerciseId INTEGER NOT NULL,
            FOREIGN KEY (WorkoutId) REFERENCES Workouts(ID),
            FOREIGN KEY (ExerciseId) REFERENCES exercises(exerciseId)
            )",
        [],
    )
    .expect("failed to initialize schema WorkoutExercises");

    // Tauri building process
    tauri::Builder::default()
    
        .manage(Db {
            conn: Mutex::new(conn),
        })
        .plugin(tauri_plugin_opener::init())
        // Add all frontend functions here
        .invoke_handler(tauri::generate_handler![
            list_workouts,
            create_workout,
            link_exercise,
            create_exercise,
            get_exercise_by_id::return_exercise,
            get_all_exercises::get_all_exercises,
            get_workout
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
