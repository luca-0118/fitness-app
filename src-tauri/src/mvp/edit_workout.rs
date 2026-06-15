use rusqlite::{params_from_iter, Transaction};
use tauri::State;

use crate::{
    api::{ApiError, ApiErrorResponse, ApiResponse},
    interface::dto::CreateWorkoutDTO,
    Ctx,
};

pub fn err_handler(err: rusqlite::Error) -> ApiError {
    println!("Error found while updating workout {:?}", err);
    return ApiError::DatabaseError;
}

#[tauri::command]
pub fn edit_workout(
    ctx: State<Ctx>,
    workout_obj: CreateWorkoutDTO,
) -> Result<ApiResponse<bool>, ApiErrorResponse> {
    let resp = ctx
        .db
        .use_conn(|tx| {
            let exercises = workout_obj
                .exercises
                .clone()
                .expect("could not copy exercises");

            //updates name, desc, uuid
            update_workout_metadata(&tx, &workout_obj.name, &workout_obj.desc, &workout_obj.uuid)?;

            remove_all_exercises(&tx, &workout_obj.uuid)?;

            add_exercises(&tx, &workout_obj.uuid, exercises)?;

            Ok(true)
        })
        .map_err(err_handler)?;

    Ok(ApiResponse {
        ok: true,
        data: resp,
    })
}

/// updates the workout name,desc,and uuid.
fn update_workout_metadata(
    tx: &Transaction,
    name: &str,
    desc: &str,
    uuid: &str,
) -> Result<usize, rusqlite::Error> {
    let mut stmt = tx.prepare(
        "UPDATE Workouts
                        SET Name = ?1,
                        Desc = ?2
                        WHERE Uuid = ?3
        ",
    )?;

    // returns true if the amount of changed rows is bigger than 0.
    stmt.execute([name, desc, uuid])
}

/// Removes all exercises from the workout of the given uuid.
fn remove_all_exercises(tx: &Transaction, uuid: &str) -> Result<usize, rusqlite::Error> {
    let mut stmt = tx.prepare("DELETE FROM WorkoutExercises WHERE WorkoutId = ?1")?;

    stmt.execute([uuid])
}

/// adds all the given workoutIds to the workout of the uuid.
fn add_exercises(
    tx: &Transaction,
    uuid: &str,
    exercises: Vec<String>,
) -> Result<usize, rusqlite::Error> {
    let order_strs: Vec<String> = (0..exercises.len()).map(|i| i.to_string()).collect();

    let mut query =
        String::from("INSERT INTO WorkoutExercises (WorkoutId, ExerciseId,orderNr) VALUES ");

    let mut params_vec = Vec::new();

    exercises.iter().enumerate().for_each(|(i, exercise_id)| {
        if i > 0 {
            query.push_str(", ");
        }
        query.push_str("(?, ?, ?)");
        params_vec.push(uuid);
        params_vec.push(exercise_id);
        params_vec.push(&order_strs[i]);
    });

    tx.execute(&query, params_from_iter(params_vec))
}
