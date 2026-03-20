use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::{api, Db};
use crate::api::{ApiError, ApiErrorResponse};
use crate::models;

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateWorkout {
    pub name: String,
    pub desc: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LinkExercise {
    pub workout_uuid: String,
    pub exercise_uuid: String,
}

#[derive(Debug, Serialize)]
pub struct IdetailedWorkoutDTO {
    pub uuid: String,
    pub name: String,
    pub exercises: Vec<models::Exercise>,
}

pub fn list(db: &Db) -> Result<Vec<models::Workout>, ApiError> {
    let conn = db
        .conn
        .lock()
        .map_err(|_| api::ApiError::FailedDbConnection)?;

    let mut stmt = conn.prepare(
        "SELECT Uuid, Name, Desc
        FROM Workouts",
    )?;

    let workout_iter = stmt.query_map([], |row| {
        Ok(models::Workout {
            uuid: row.get(0)?,
            name: row.get(1)?,
            desc: row.get(2)?,
        })
    })?;

    let workouts: Result<Vec<models::Workout>, rusqlite::Error> = workout_iter.collect();
    let workouts = workouts?;
    Ok(workouts)
}

pub fn create(db: &Db, workout: CreateWorkout) -> Result<String, ApiError> {
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

pub fn link_exercise(db: &Db, link_exercise: LinkExercise) -> Result<String, ApiError> {
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

pub fn detailed(db: &Db, workout_uuid: String) -> Result<IdetailedWorkoutDTO, ApiError> {
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
        "SELECT e.*
        FROM WorkoutExercises we
        INNER JOIN Exercises e ON e.exerciseid = we.ExerciseId
        WHERE we.WorkoutId = (SELECT ID FROM Workouts WHERE Uuid = ?1)",
    )?;

    let exercises_iter = stmt.query_map([&workout_uuid], |row| {
        Ok(models::Exercise {
            exercise_id:        row.get(0)?,
            name:               row.get(1)?,
            gif_url:            row.get(2)?,
            target_muscles:     row.get(3)?,
            body_parts:         row.get(4)?,
            equipments:         row.get(5)?,
            secondary_muscles:  row.get(6)?,
            instructions:       row.get(7)?,
        })
    })?;

    let exercises: Result<Vec<models::Exercise>, rusqlite::Error> = exercises_iter.collect();

    Ok(IdetailedWorkoutDTO {
        uuid: workout.0,
        name: workout.1,
        exercises: exercises?,
    })
}

pub fn history(db: &Db) -> Result<models::IWorkoutHistory, ApiErrorResponse> {
    let conn = db
        .conn
        .lock()
        .map_err(|_| api::ApiError::FailedDbConnection)?;

    let mut stmt = conn.prepare(
        "SELECT w.Name,wh.sessionId,wh.started_at,wh.completed_at FROM workoutHistory wh
             INNER JOIN Workouts w ON wh.workoutId = w.Uuid;",
    ).map_err(|_| ApiError::DatabaseError)?;

    let workout_iter = stmt.query_map([], |row| {
        Ok(models::WorkoutHistory {
            workout_name: row.get(0)?,
            session_uuid: row.get(1)?,
            start_date: row.get(2)?,
            end_date: row.get(3)?
        })
    }).map_err(|_| ApiError::DatabaseError)?;

    let workout_history_list: Result<models::IWorkoutHistory,rusqlite::Error> = workout_iter.collect();

    return match workout_history_list {
        Ok(workout_history_list) => {
            Ok(workout_history_list)
        }
        Err(_) => {
            Err(ApiError::DatabaseError.into())
        }
    }

}