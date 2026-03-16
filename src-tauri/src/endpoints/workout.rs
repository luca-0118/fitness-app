use crate::{api, logic, models, Db};
use crate::api::ApiResponse;
use crate::logic::workout::{CreateWorkout, IdetailedWorkoutDTO, LinkExercise};

#[tauri::command]
pub fn list_workouts(
    db: tauri::State<Db>,
) -> Result<api::ApiResponse<Vec<models::Workout>>, api::ApiErrorResponse> {
    // Connects conn mutex to this thread.

    let workouts = logic::workout::list(&db)?;

    Ok(ApiResponse {
        ok: true,
        data: workouts,
    })
}

#[tauri::command]
pub fn create_workout(
    db: tauri::State<Db>,
    workout: CreateWorkout,
) -> Result<api::ApiResponse<String>, api::ApiErrorResponse> {
    // Early exit if the values are empty.
    // Desc can be empty
    if workout.name.trim().is_empty() {
        return Err(api::ApiError::InvalidInput.into());
    }

    let response = logic::workout::create(&db, workout)?;

    Ok(ApiResponse {
        ok: true,
        data: response.to_string(),
    })
}

#[tauri::command]
pub fn link_exercise(
    db: tauri::State<Db>,
    link_exercise: LinkExercise,
) -> Result<api::ApiResponse<String>, api::ApiErrorResponse> {
    // checks if both exercise Id and workout Id are given.
    if link_exercise.exercise_uuid.is_empty() || link_exercise.workout_uuid.is_empty() {
        return Err(api::ApiError::InvalidInput.into());
    }

    let resp = logic::workout::link_exercise(&db, link_exercise)?;

    Ok(ApiResponse {
        ok: true,
        data: resp,
    })
}

#[tauri::command]
pub fn get_workout(
    db: tauri::State<Db>,
    _workout_uuid: String,
) -> Result<api::ApiResponse<IdetailedWorkoutDTO>, api::ApiErrorResponse> {
    let response = logic::workout::detailed(&db, _workout_uuid)?;
    Ok(ApiResponse {
        ok: true,
        data: response,
    })
}