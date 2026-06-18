use std::sync::{Mutex, MutexGuard};
use tauri::Manager;
mod api;
mod application;
mod domain;
mod infrastructures;
mod interface;
pub mod lars;
mod mvp;
mod repository;

use crate::api::{ApiError, ApiErrorResponse};
use crate::application::session_service::SessionService;
use crate::application::workout_service::WorkoutService;
use crate::domain::{
    CompletedExerciseRepo, ExerciseRepo, WorkoutExerciseRepo, WorkoutHistoryRepo, WorkoutRepo,
};
use crate::repository::completed_exercise_repository::CompletedExerciseRepository;
use crate::repository::exercise_repository::ExerciseRepository;
use crate::repository::workout_exercise_repository::WorkoutExerciseRepository;
use crate::repository::workout_history_repository::WorkoutHistoryRepository;
use infrastructures::sqlite::Db;
use repository::workout_repository::WorkoutRepository;

struct Ctx {
    service: Service,
    db: Db,
}

struct Service {
    workout: WorkoutService,
    session: Mutex<SessionService>,
}

impl Service {
    pub fn session(&'_ self) -> Result<MutexGuard<'_, SessionService>, ApiErrorResponse> {
        self.session
            .lock()
            .map_err(|_| ApiError::PoisonedLock.into())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // sets up the default structure of the database.
    let mut builder = tauri::Builder::default();

    #[cfg(any(target_os = "android", target_os = "ios"))]
    {
        builder = builder.plugin(tauri_plugin_barcode_scanner::init());
    }

    builder
        .setup(|app| {
            // moves the database file to the right location
            // and sets up additional tables.
            infrastructures::sqlite::build_database(app);

            //creates an connection to the database.
            let conn = infrastructures::sqlite::get_connection(app);

            // creates a new db object with the connection from sqlite
            let db = Db::new(conn);

            app.manage(Ctx {
                db: db.clone(),
                service: Service {
                    // creates a new workout service
                    workout: WorkoutService::new(
                        //these are repositories that use the databases.
                        //All functions that are used with the database are in here.
                        WorkoutRepository::new(db.clone()),
                        ExerciseRepository::new(db.clone()),
                        WorkoutExerciseRepository::new(db.clone()),
                    ),
                    //adds the new sessionService
                    session: Mutex::new(SessionService::new(
                        WorkoutExerciseRepository::new(db.clone()),
                        WorkoutHistoryRepository::new(db.clone()),
                        CompletedExerciseRepository::new(db.clone()),
                    )),
                },
            });
            //finish
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        // Add all frontend functions here
        .invoke_handler(tauri::generate_handler![
            interface::tauri_commands::list_workouts,
            interface::tauri_commands::create_workout,
            interface::tauri_commands::get_all_exercises,
            interface::tauri_commands::create_workout_with_exercises,
            interface::tauri_commands::get_workout,
            interface::tauri_commands::start_session,
            interface::tauri_commands::get_session,
            interface::tauri_commands::update_session_set,
            interface::tauri_commands::complete_session,
            interface::tauri_commands::workout_history,
            lars::get_products,
            interface::tauri_commands::remove_workout,
            lars::get_exercise_by_id,
            lars::add_food,
            lars::get_product_by_barcode,
            lars::get_food_by_date,
            lars::delete_food_by_id,
            mvp::get_single_food_entry,
            mvp::update_stored_products,
            mvp::edit_workout,
            interface::tauri_commands::get_detailed_session_history,
            mvp::create_predictive_graph,
            interface::tauri_commands::add_session_set,
            interface::tauri_commands::remove_session_set
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
