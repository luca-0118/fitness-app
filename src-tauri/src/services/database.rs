
use rusqlite::Connection;

// Logic for establishing a connection.
pub fn establish_connection() -> Connection {
    Connection::open("../public/workoutbase.sqlite")
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
