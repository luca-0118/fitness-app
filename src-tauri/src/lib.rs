use rusqlite::Connection;
use std::sync::Mutex;

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
    let conn = services::database::establish_connection();

    // sets up the default structure of the database.
    services::database::migrate(&conn);

    // Tauri building process
    tauri::Builder::default()
        //the default connection to the database
        .manage(Db {
            conn: Mutex::new(conn),
        })

        //Used for future state management.
        .manage(Mutex::new( models::Session{
            session_uuid: String::new(),
            workout_uuid: String::new(),
            workout_name: String::new(),
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
            endpoints::session::get_session,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


