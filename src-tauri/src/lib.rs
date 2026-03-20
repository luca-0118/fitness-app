use rusqlite::Connection;
use tauri::Manager;
use std::sync::Mutex;

mod api;
mod logic;
mod models;
mod endpoints;
mod services;

struct Db {
    conn: Mutex<Connection>,
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
            endpoints::get_exercises_by_muscle::get_exercises_by_muscle,
            endpoints::session::get_session,
            endpoints::session::update_set,
            endpoints::session::complete_session,
            endpoints::session::workout_history
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}



