use openfoodfacts::Error;
use tauri::State;

use crate::{
    api::{ApiError, ApiErrorResponse, ApiResponse},
    interface::dto::CreateWorkoutDTO,
    Ctx,
};

pub fn err_handler(err: Error) -> ApiError {
    println!("Error found while updating workout {:?}", err);
    return ApiError::DatabaseError;
}

#[tauri::command]
pub fn edit_workout(
    ctx: State<Ctx>,
    workout_obj: CreateWorkoutDTO,
) -> Result<ApiResponse<bool>, ApiErrorResponse> {
    //updates name, desc, uuid
    update_workout_metadata(
        &ctx,
        &workout_obj.name,
        &workout_obj.desc,
        &workout_obj.uuid,
    )
    .map_err(err_handler)?;

    remove_all_exercises(&ctx, &workout_obj.uuid).map_err(err_handler)?;

    add_exercises(&ctx, &workout_obj.uuid, workout_obj.exercises).map_err(err_handler)?;

    Ok(ApiResponse {
        ok: true,
        data: true,
    })
}

/// updates the workout name,desc,and uuid.
fn update_workout_metadata(ctx: &Ctx, name: &str, desc: &str, uuid: &str) -> Result<bool, Error> {
    let resp = ctx.db.use_conn(|tx| {
        let mut stmt = tx.prepare(
            "UPDATE Workout
                        SET Name = ?1,
                        Desc = ?2,
                        WHERE Uuid = ?3
        ",
        )?;

        // returns true if the amount of changed rows is bigger than 0.
        let rows_changed = stmt.execute([name, desc, uuid])?;
        Ok(rows_changed > 0)
    });

    Ok(resp?)
}

/// Removes all exercises from the workout of the given uuid.
fn remove_all_exercises(ctx: &Ctx, uuid: &str) -> Result<bool, Error> {}

/// adds all the given workoutIds to the workout of the uuid.
fn add_exercises(ctx: &Ctx, uuid: &str, exercises: Option<Vec<String>>) -> Result<bool, Error> {}
