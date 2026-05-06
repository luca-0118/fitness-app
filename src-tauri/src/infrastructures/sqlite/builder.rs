use std::{env, path::PathBuf};

use rusqlite::Connection;
use tauri::{App, Manager};

enum AppState {
    Dev = 0,
    Stable = 1,
}

pub fn build_database(app: &mut App) {
    //gets the incoming command and sees if there's a clean arguement.
    // if there is we delete the database
    let clean = std::env::args().any(|arg| arg == "--clean");

    let mode = if clean {
        AppState::Dev
    } else {
        AppState::Stable
    };

    let db_path = instantiate(app);
    let mut conn = establish_connection(&db_path);
    migrate(&mut conn, mode);
    conn.close().expect("Couldnt close Connection");
}

fn instantiate(app: &mut App) -> PathBuf {
    let db_path = app
        .path()
        .resolve("workoutbase.db", tauri::path::BaseDirectory::AppLocalData)
        .expect("pathbuf not found");

    // Check if database already exists
    if !db_path.exists() {
        // Ensure the parent directory exists
        if let Some(parent) = db_path.parent() {
            std::fs::create_dir_all(parent).expect("directory couldn't be created.");
        }

        // Embed and write the template database
        let template_bytes = include_bytes!("../../resources/workoutbase.db");
        std::fs::write(&db_path, template_bytes).expect("Failed to write database template");
    }

    db_path
}

// Logic for establishing a connection.
fn establish_connection(dbpath: &PathBuf) -> Connection {
    Connection::open(dbpath).expect("Failed to open or create database")
}

// Creates all the default structure for the database (for workouts and connecting exercises to workouts.)
fn migrate(conn: &mut Connection, state: AppState) {
    let tx = conn.transaction().unwrap();

    match state {
        AppState::Dev => {
            tx.execute("PRAGMA foreign_keys = OFF", [])
                .expect("failed to disable foreign keys");

            // Drop in reverse dependency order to avoid FK constraint issues
            tx.execute("DROP TABLE IF EXISTS completedWeightExercises", [])
                .unwrap();
            tx.execute("DROP TABLE IF EXISTS completedCardioExercises", [])
                .unwrap();
            tx.execute("DROP TABLE IF EXISTS completedExercises", [])
                .unwrap();
            tx.execute("DROP TABLE IF EXISTS workoutHistory", [])
                .unwrap();
            tx.execute("DROP TABLE IF EXISTS WorkoutExercises", [])
                .unwrap();
            tx.execute("DROP TABLE IF EXISTS Workouts", []).unwrap();
        }
        AppState::Stable => {}
    }

    tx.execute(
        "CREATE TABLE IF NOT EXISTS Workouts (
        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        Uuid TEXT NOT NULL UNIQUE,
        Name TEXT NOT NULL,
        Desc TEXT
        );",
        [],
    )
    .expect("failed to initialize schema Workouts");

    //Workout exercises table
    // NOTE PRAGMA foreign_keys = ON; is required, otherwise foreign keys won't work.
    tx.execute("PRAGMA foreign_keys = ON", [])
        .expect("foreign keys disabled");

    tx.execute(
        "CREATE TABLE IF NOT EXISTS WorkoutExercises (
        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        orderNr INTEGER NOT NULL,
        WorkoutId TEXT NOT NULL,
        ExerciseId TEXT NOT NULL,
        FOREIGN KEY (WorkoutId) REFERENCES Workouts(Uuid) ON DELETE CASCADE,
        FOREIGN KEY (ExerciseId) REFERENCES exercises(exerciseid)
        )",
        [],
    )
    .expect("failed to initialize schema WorkoutExercises");

    tx.execute(
        "CREATE TABLE IF NOT EXISTS workoutHistory (
        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        sessionId TEXT UNIQUE NOT NULL,
        workoutId TEXT,
        started_at TEXT NOT NULL,
        completed_at TEXT NOT NULL,
        FOREIGN KEY (workoutId) REFERENCES Workouts(Uuid)
    )",
        [],
    )
    .unwrap();

    tx.execute(
        "CREATE TABLE IF NOT EXISTS completedExercises (
        ID TEXT NOT NULL PRIMARY KEY,
        sessionId TEXT NOT NULL,
        exerciseId TEXT NOT NULL,
        Time_completed TEXT NOT NULL DEFAULT 'test',
        FOREIGN KEY (sessionId) REFERENCES workoutHistory(sessionId)
    )",
        [],
    )
    .unwrap();

    tx.execute(
        "CREATE TABLE IF NOT EXISTS completedCardioExercises (
        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        completedExerciseId TEXT NOT NULL ,
        time FLOAT,
        distance FLOAT,
        FOREIGN KEY (completedExerciseId) REFERENCES completedExercises(ID) ON DELETE CASCADE
    )",
        [],
    )
    .unwrap();

    tx.execute(
        "CREATE TABLE IF NOT EXISTS completedWeightExercises (
        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        completedExerciseId TEXT NOT NULL,
        reps FLOAT,
        weight FLOAT,
        FOREIGN KEY (completedExerciseId) REFERENCES completedExercises(ID) ON DELETE CASCADE
    )",
        [],
    )
    .unwrap();

    tx.commit().unwrap();
}

pub fn get_connection(app: &App) -> Connection {
    let db_path = app
        .path()
        .resolve("workoutbase.db", tauri::path::BaseDirectory::AppLocalData)
        .expect("pathbuf not found");

    Connection::open(db_path).expect("Failed to open or create database")
}
