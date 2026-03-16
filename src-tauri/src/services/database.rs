
use std::path::PathBuf;

use rusqlite::Connection;
use tauri::{App, Manager};

pub fn instantiate(app: &mut App) -> PathBuf {
            let db_path = app.path().resolve(
                "workoutbase.sqlite",
                tauri::path::BaseDirectory::AppLocalData,
            ).expect("pathbuf not found");

            // Check if database already exists
            if !db_path.exists() {
                // Ensure the parent directory exists
                if let Some(parent) = db_path.parent() {
                    std::fs::create_dir_all(parent).expect("directory couldn't be created.");
                }

                // Embed and write the template database
                let template_bytes = include_bytes!("../resources/workoutbase.sqlite");
                std::fs::write(&db_path, template_bytes)
                    .expect("Failed to write database template");
            }

            db_path
}

// Logic for establishing a connection.
pub fn establish_connection(dbpath: &PathBuf) -> Connection {
    Connection::open(dbpath)
        .expect("Failed to open or create database")
}


// Creates all the default structure for the database (for workouts and connecting exercises to workouts.)
pub fn migrate(conn: &Connection) {
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

    //Workout exercises table
    // NOTE PRAGMA foreign_keys = ON; is required, otherwise foreign keys won't work.
    conn.execute("PRAGMA foreign_keys = ON", [])
        .expect("foreign keys disabled");

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
}
