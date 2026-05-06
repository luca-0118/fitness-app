use rusqlite::Error;

use crate::domain::{CompletedWorkout, CompletedWorkouts};
use crate::{
    domain::{SaveSessionParams, WorkoutHistoryRepo},
    infrastructures::sqlite::Db,
};

pub struct WorkoutHistoryRepository {
    db: Db,
}

impl WorkoutHistoryRepo for WorkoutHistoryRepository {
    fn new(db: Db) -> Self {
        Self { db }
    }

    fn add(&self, params: SaveSessionParams) -> Result<bool, Error> {
        self.db.use_conn(|tx| {
                tx.execute("INSERT INTO workoutHistory(SessionId,WorkoutId,Started_at,Completed_at) VALUES (?1,?2,?3,?4)",
            [params.session_id,params.workout_id,params.started_at,params.completed_at])
            })?;
        Ok(true)
    }

    fn get_history(&self) -> Result<CompletedWorkouts, Error> {
        self.db.use_conn(|tx| {
            let mut stmt = tx.prepare(
                "SELECT w.Name,wh.sessionId,wh.started_at,wh.completed_at FROM workoutHistory wh
             INNER JOIN Workouts w ON wh.workoutId = w.Uuid;",
            )?;

            let workout_history = stmt.query_map([], |row| {
                Ok(CompletedWorkout {
                    workout_name: row.get(0)?,
                    session_uuid: row.get(1)?,
                    start_date: row.get(2)?,
                    end_date: row.get(3)?,
                })
            })?;

            let workout_history_list: Result<CompletedWorkouts, Error> = workout_history.collect();

            Ok(workout_history_list?)
        })
    }
}
