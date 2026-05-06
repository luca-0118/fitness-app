use crate::api::{ApiError, ApiErrorResponse, ApiResponse};
use crate::application::workout_service::{CreateWorkoutRequest, WorkoutListParams};
use crate::interface::dto::{
    CreateWorkoutDTO, ExerciseListDTO, ExerciseRecordDTO, SessionDTO, UpdateSessionSetReq,
    WorkoutDTO, WorkoutHistoryDTO, WorkoutsDTO,
};
use crate::Ctx;
use tauri::State;

#[tauri::command]
pub fn list_workouts(ctx: State<Ctx>) -> Result<ApiResponse<WorkoutsDTO>, ApiErrorResponse> {
    let workouts = ctx.service.workout.list_workouts()?;

    //remap to DTO
    let workout_list: WorkoutsDTO = workouts.into_iter().map(WorkoutDTO::from).collect();

    // Return response
    Ok(ApiResponse {
        ok: true,
        data: workout_list,
    })
}

#[tauri::command]
pub fn create_workout(
    ctx: State<Ctx>,
    req: CreateWorkoutDTO,
) -> Result<ApiResponse<String>, ApiErrorResponse> {
    let req = CreateWorkoutRequest {
        uuid: req.uuid,
        name: req.name,
        desc: Option::from(req.desc),
        exercises: None,
    };

    let id = ctx.service.workout.create_workout(req)?;

    Ok(ApiResponse { ok: true, data: id })
}

#[tauri::command]
pub fn create_workout_with_exercises(
    ctx: State<Ctx>,
    req: CreateWorkoutRequest,
) -> Result<ApiResponse<String>, ApiErrorResponse> {
    let response = ctx.service.workout.create_workout_with_exercises(req)?;

    Ok(ApiResponse {
        ok: true,
        data: response,
    })
}

#[tauri::command]
pub fn get_all_exercises(
    ctx: State<Ctx>,
    req: WorkoutListParams,
) -> Result<ApiResponse<ExerciseListDTO>, ApiErrorResponse> {
    let resp = ctx.service.workout.list_exercises(req)?;

    let data: ExerciseListDTO = resp.into_iter().map(ExerciseRecordDTO::from).collect();

    Ok(ApiResponse { ok: true, data })
}

#[tauri::command]
pub fn get_workout(
    ctx: State<Ctx>,
    req: String,
) -> Result<ApiResponse<WorkoutDTO>, ApiErrorResponse> {
    let detailed_workout = ctx.service.workout.get_detailed_workout(req)?;

    Ok(ApiResponse {
        ok: true,
        data: WorkoutDTO::from(detailed_workout),
    })
}

#[tauri::command]
pub fn start_session(
    ctx: State<Ctx>,
    req: String,
) -> Result<ApiResponse<String>, ApiErrorResponse> {
    // sadly we have to mutex this shit due to changing states.
    let session_uuid = ctx.service.session()?.start_session(req)?;

    Ok(ApiResponse {
        ok: true,
        data: session_uuid,
    })
}

#[tauri::command]
pub fn get_session(ctx: State<Ctx>) -> Result<ApiResponse<SessionDTO>, ApiErrorResponse> {
    let current_session = ctx
        .service
        .session()?
        .get_session()
        .ok_or(ApiError::SessionNotFound)?;

    Ok(ApiResponse {
        ok: true,
        data: SessionDTO::from(current_session),
    })
}

#[tauri::command]
pub fn update_session_set(
    ctx: State<Ctx>,
    req: UpdateSessionSetReq,
) -> Result<ApiResponse<String>, ApiErrorResponse> {
    // remaps the incoming data into a new object for the application layer.
    let request = req.to_service_request();

    let resp = ctx.service.session()?.update_session_set(request)?;

    Ok(ApiResponse {
        ok: true,
        data: resp,
    })
}

#[tauri::command]
pub fn complete_session(ctx: State<Ctx>) -> Result<ApiResponse<String>, ApiErrorResponse> {
    let resp = ctx.service.session()?.save_session()?;

    Ok(ApiResponse {
        ok: true,
        data: resp.to_string(),
    })
}

#[tauri::command]
pub fn workout_history(
    ctx: State<Ctx>,
) -> Result<ApiResponse<Vec<WorkoutHistoryDTO>>, ApiErrorResponse> {
    let history = ctx.service.session()?.workout_history()?;

    let history_dtos: Vec<WorkoutHistoryDTO> =
        history.into_iter().map(WorkoutHistoryDTO::from).collect();

    Ok(ApiResponse {
        ok: true,
        data: history_dtos,
    })
}

#[tauri::command]
pub fn remove_workout(
    ctx: State<Ctx>,
    req: String,
) -> Result<ApiResponse<String>, ApiErrorResponse> {
    let response = ctx.service.workout.delete_workout(req)?;

    Ok(ApiResponse {
        ok: response,
        data: "Workout removed".to_string(),
    })
}
