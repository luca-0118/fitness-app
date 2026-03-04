use crate::api::{self, ApiError};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Exercise {
    id: String,
    name: String,
    data: String,
}

#[tauri::command]
pub fn get_all_exercises() -> Result<api::ApiResponse<Vec<Exercise>>, api::ApiErrorResponse> {
    let conn = rusqlite::Connection::open("test.db").map_err(ApiError::from)?;

    let mut stmt = conn.prepare("select * from exercises").map_err(ApiError::from)?;

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