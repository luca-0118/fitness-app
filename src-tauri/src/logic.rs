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
pub fn create_workout(db: &Db, workout: dto::CreateWorkout) -> Result<String, ApiError> {
    let conn = db
        .conn
        .lock()
        .map_err(|_| api::ApiError::FailedDbConnection)?;

    let id = Uuid::new_v4();

    conn.execute(
        "INSERT INTO Workouts(Uuid,Name,Desc) VALUES (?1, ?2, ?3)",
        (&id.to_string(), workout.name, workout.desc),
    )
    .map_err(|_| api::ApiError::DatabaseError)?;

    Ok(id.to_string())
}

pub fn link_exercise(db: &Db, link_exercise: dto::LinkExercise) -> Result<String, ApiError> {
    let conn = db
        .conn
        .lock()
        .map_err(|_| api::ApiError::FailedDbConnection)?;

    // FIXME, this is sub-optimal, ideally, every id needs to be UUID.
    conn.execute(
        r#"
        INSERT INTO WorkoutExercises (WorkoutId, ExerciseId)
        VALUES (
            (SELECT ID FROM Workouts WHERE Uuid = ?1),
            (SELECT exerciseid FROM Exercises WHERE exerciseid = ?2)
        )
        "#,
        (link_exercise.workout_uuid, link_exercise.exercise_uuid),
    )?;

    Ok(format!("exercise has been linked to workout"))
}

pub fn create_exercise(db: &Db, exercise: dto::CreateExercise) -> Result<bool, ApiError> {
    let conn = db
        .conn
        .lock()
        .map_err(|_| api::ApiError::FailedDbConnection)?;

    let id = Uuid::new_v4();

    conn.execute(
        "INSERT INTO Exercises(Uuid,Name,Desc) VALUES (?1, ?2, ?3)",
        (id.to_string(), exercise.name, exercise.desc),
    )
    .map_err(|_| api::ApiError::DatabaseError)?;

    Ok(true)
}

pub fn get_workout(db: &Db, workout_uuid: String) -> Result<dto::IdetailedWorkoutDTO, ApiError> {
    let conn = db
        .conn
        .lock()
        .map_err(|_| api::ApiError::FailedDbConnection)?;

    // Get the workout info
    let workout = conn.query_row(
        "SELECT Uuid, Name FROM Workouts WHERE Uuid = ?1",
        [&workout_uuid],
        |row| Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?)),
    )?;

    // Get the exercises for this workout
    let mut stmt = conn.prepare(
        "SELECT e.exerciseid, e.name, e.gifUrl
        FROM WorkoutExercises we
        INNER JOIN Exercises e ON e.exerciseid = we.ExerciseId
        WHERE we.WorkoutId = (SELECT ID FROM Workouts WHERE Uuid = ?1)",
    )?;

    let exercises_iter = stmt.query_map([&workout_uuid], |row| {
        Ok(dto::ExerciseDTO {
            id: row.get(0)?,
            name: row.get(1)?,
            data: row.get(2)?,
        })
    })?;

    let exercises: Result<Vec<dto::ExerciseDTO>, rusqlite::Error> = exercises_iter.collect();

    Ok(dto::IdetailedWorkoutDTO {
        uuid: workout.0,
        name: workout.1,
        exercises: exercises?,
    })
}
