use rusqlite::Connection;
use std::sync::Mutex;

use crate::api::ApiResponse;
mod api;
mod dto;
mod logic;
struct Db {
    conn: Mutex<Connection>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let conn = Connection::open("../public/workoutbase.sqlite")
        .expect("Failed to open or create database");

    // Creates database tables

    // Workout table
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

    // Exercises table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS Exercises(
                    ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    Name TEXT NOT NULL,
                    Desc TEXT
                    )",
        [],
    )
    .expect("failed to initialize schema Exercises");

    //Workout exercises table
    // NOTE PRAGMA foreign_keys = ON; is required, otherwise foreign keys won't work.
    conn.execute(
        "PRAGMA foreign_keys = ON;
            CREATE TABLE IF NOT EXISTS WorkoutExercises (
            ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            WorkoutId INTEGER NOT NULL,
            ExerciseId INTEGER NOT NULL,
            FOREIGN KEY (WorkoutId) REFERENCES Workouts(ID),
            FOREIGN KEY (ExerciseId) REFERENCES Exercises(ID)
            )",
        [],
    )
    .expect_err("failed to initialize schema WorkoutExercises");

    // Tauri building process
    tauri::Builder::default()
        .manage(Db {
            conn: Mutex::new(conn),
        })
        .plugin(tauri_plugin_opener::init())
        // Add all frontend functions here
        .invoke_handler(tauri::generate_handler![
            greet,
            list_workouts,
            create_workout
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
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

    logic::create_workout(&db, workout)?;

    Ok(ApiResponse {
        ok: true,
        data: "new workout has been stored".to_string(),
    })
}
