use crate::{
    api::{self, ApiError},
    dto::{self, Workout},
    Db,
};

// calls all the available workouts from the database
pub fn list_workouts(db: &Db) -> Result<Vec<dto::Workout>, ApiError> {
    let conn = db
        .conn
        .lock()
        .map_err(|_| api::ApiError::FailedDbConnection)?;

    let mut stmt = conn.prepare(
        "SELECT Name, Desc
        FROM Workouts",
    )?;

    let workout_iter = stmt.query_map([], |row| {
        Ok(dto::Workout {
            name: row.get(0)?,
            desc: row.get(1)?,
        })
    })?;
    let workouts: Result<Vec<Workout>, rusqlite::Error> = workout_iter.collect();
    let workouts = workouts?;
    return Ok(workouts);
}

//creates a new workout
pub fn create_workout(db: &Db, workout: dto::Workout) -> Result<bool, ApiError> {
    let conn = db
        .conn
        .lock()
        .map_err(|_| api::ApiError::FailedDbConnection)?;

    conn.execute(
        "INSERT INTO Workouts(Name,Desc) VALUES (?1, ?2)",
        (workout.name, workout.desc),
    )
    .map_err(|_| api::ApiError::DatabaseError)?;

    Ok(true)
}
