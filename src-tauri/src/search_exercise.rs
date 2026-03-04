use crate::api::{self, ApiError};


#[derive(serde::Serialize)]
pub struct Exercise{
    id: String,
    name: String,
    gif: String
}

#[tauri::command]
pub fn search_exercise(exercise_name: &str) -> Result<api::ApiResponse<Vec<Exercise>>, api::ApiErrorResponse>  {
    let connection = rusqlite::Connection::open("test.db").unwrap();
    let mut query = connection.prepare("SELECT * FROM exercises WHERE name LIKE '%?1%'").unwrap();

    let mut rows = query.query([exercise_name]).unwrap();

    let mut  exercises = Vec::new();

    if let Some(row) = rows.next().unwrap(){
        exercises.push(        
            Exercise{
            id: row.get(0).unwrap(),
            name: row.get(1).unwrap(),
            gif: row.get(2).unwrap()
        });

        return Ok(api::ApiResponse {
            ok: true,
            data: exercises
        })

    }

   else {return Err(api::ApiError::InvalidInput.into())}


}