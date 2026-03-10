use rusqlite::Connection;
use std::sync::Mutex;
mod get_all_exercises;
mod get_exercise_by_id;

use crate::api::ApiResponse;
mod api;
mod dto;
mod logic;

use tauri::Manager;
struct Db {
    conn: Mutex<Connection>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let db_path = app.path().resolve(
                "workoutbase.sqlite",
                tauri::path::BaseDirectory::AppLocalData,
            )?;

            // Check if database already exists
            if !db_path.exists() {
                // Ensure the parent directory exists
                if let Some(parent) = db_path.parent() {
                    std::fs::create_dir_all(parent)?;
                }

                // Embed and write the template database
                let template_bytes = include_bytes!("../resources/workoutbase.sqlite");
                std::fs::write(&db_path, template_bytes)
                    .expect("Failed to write database template");
            }

            // Open the database
            let conn = Connection::open(&db_path).expect("Failed to open or create database");

            // Drop and recreate tables (for development - remove in production)
            conn.execute("DROP TABLE IF EXISTS WorkoutExercises", [])
                .expect("failed to drop table WorkoutExercises");

            conn.execute("DROP TABLE IF EXISTS Workouts", [])
                .expect("failed to drop table Workouts");

            // Enable foreign keys
            conn.execute("PRAGMA foreign_keys = ON", [])
                .expect("foreign keys disabled");

            // Create Workouts table
            conn.execute(
                "CREATE TABLE IF NOT EXISTS Workouts (
                    ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    Uuid TEXT NOT NULL,
                    Name TEXT NOT NULL,
                    Desc TEXT
                );",
                [],
            )
            .expect("failed to initialize schema Workouts");

            // Create WorkoutExercises table
            conn.execute(
                "CREATE TABLE IF NOT EXISTS WorkoutExercises (
                    ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    WorkoutId INTEGER NOT NULL,
                    ExerciseId INTEGER NOT NULL,
                    FOREIGN KEY (WorkoutId) REFERENCES Workouts(ID),
                    FOREIGN KEY (ExerciseId) REFERENCES exercises(exerciseId)
                )",
                [],
            )
            .expect("failed to initialize schema WorkoutExercises");

            // Manage the database connection in app state
            app.manage(Db {
                conn: Mutex::new(conn),
            });

            Ok(())
        })
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
