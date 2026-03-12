use rusqlite::Connection;
use std::sync::Mutex;
use uuid::Uuid;

mod api;
mod logic;
mod models;
mod endpoints;
mod services;

struct Db {
    conn: Mutex<Connection>,
}
struct SessionState {
    session_uuid: String,
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
        .manage(SessionState{
            session_uuid: Uuid::new_v4().to_string(),
        })

        .plugin(tauri_plugin_opener::init())

        // Add all frontend functions here
        .invoke_handler(tauri::generate_handler![
            endpoints::get_exercise_by_id::return_exercise,
            endpoints::get_all_exercises::get_all_exercises,
            endpoints::workout::get_workout,
            endpoints::workout::create_workout,
            endpoints::workout::list_workouts,
            endpoints::workout::link_exercise
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


