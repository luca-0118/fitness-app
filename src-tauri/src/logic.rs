use crate::{
    api::{self, ApiError},
    dto::{self, Workout},
    Db,
};
use uuid::Uuid;

// calls all the available workouts from the database
pub fn list_workouts(db: &Db) -> Result<Vec<dto::Workout>, ApiError> {
    let conn = db
        .conn
        .lock()
        .map_err(|_| api::ApiError::FailedDbConnection)?;

    let mut stmt = conn.prepare(
        "SELECT Uuid, Name, Desc
        FROM Workouts",
    )?;

    let workout_iter = stmt.query_map([], |row| {
        Ok(dto::Workout {
            uuid: row.get(0)?,
            name: row.get(1)?,
            desc: row.get(2)?,
        })
    })?;
    let workouts: Result<Vec<Workout>, rusqlite::Error> = workout_iter.collect();
    let workouts = workouts?;
    return Ok(workouts);
}

//creates a new workout
pub fn create_workout(db: &Db, workout: dto::CreateWorkout) -> Result<bool, ApiError> {
    let conn = db
        .conn
        .lock()
        .map_err(|_| api::ApiError::FailedDbConnection)?;

    let id = Uuid::new_v4();

    conn.execute(
        "INSERT INTO Workouts(Uuid,Name,Desc) VALUES (?1, ?2, ?3)",
        (id.to_string(), workout.name, workout.desc),
    )
    .map_err(|_| api::ApiError::DatabaseError)?;

    Ok(true)
}
