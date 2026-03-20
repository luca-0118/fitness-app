use crate::api::{self, ApiError};
use serde::Serialize;
use crate::Db;

#[derive(Debug, Serialize)]
pub struct Exercise {
    id: String,
    name: String,
    data: String,
}

#[tauri::command]
pub fn get_exercises_by_muscle(muscle: String,db: tauri::State<Db>) -> Result<api::ApiResponse<Vec<Exercise>>, api::ApiErrorResponse> {
    let conn = db
        .conn
        .lock()
        .map_err(|_| api::ApiError::FailedDbConnection)?;

    let query = format!(
        "SELECT * FROM exercises WHERE targetMuscles = '[\"{}\"]'",
        muscle
    );

    let mut stmt = conn.prepare(&query).map_err(ApiError::from)?;


    let exercises: Vec<Exercise> = stmt
        .query_map([], |row| {
            Ok(Exercise {
                id: row.get(0)?,
                name: row.get(1)?,
                data: row.get(2)?,
            })
        })
        .map_err(ApiError::from)?
        .collect::<rusqlite::Result<Vec<_>>>()
        .map_err(ApiError::from)?;

    Ok(api::ApiResponse {
        ok: true,
        data: exercises,
    })
}
