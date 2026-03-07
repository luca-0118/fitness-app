use crate::{api, Db};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Exercise {
    name: String,
    gif_url: String,
    target_muscles: String,
    body_parts: String,
    equipments: String,
    secondary_muscles: String,
}

#[tauri::command]
pub fn return_exercise(
    db: tauri::State<Db>,
    exercise_id: &str,
) -> Result<api::ApiResponse<Exercise>, api::ApiErrorResponse> {
    let conn = db
        .conn
        .lock()
        .map_err(|_| api::ApiError::FailedDbConnection)?;

    let mut query = conn
        .prepare("SELECT * FROM exercises WHERE exerciseid = ?1")
        .unwrap();

    let mut rows = query.query([exercise_id]).unwrap();

    if let Some(row) = rows.next().unwrap() {
        let _id: String = row.get(0).unwrap();
        let name: String = row.get(1).unwrap();
        let gif_url: String = row.get(2).unwrap();
        let target_muscles: String = row.get(3).unwrap();
        let body_parts: String = row.get(4).unwrap();
        let equipments: String = row.get(5).unwrap();
        let secondary_muscles: String = row.get(6).unwrap();

        let exercise = Exercise {
            name: name,
            gif_url: gif_url,
            target_muscles: target_muscles,
            body_parts: body_parts,
            equipments: equipments,
            secondary_muscles: secondary_muscles,
        };

        return Ok(api::ApiResponse {
            ok: true,
            data: exercise,
        });
    } else {
        return Err(api::ApiError::InvalidInput.into());
    }
}
