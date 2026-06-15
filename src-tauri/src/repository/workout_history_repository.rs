use rusqlite::{Error, Transaction};

use crate::domain::{
    CompletedExercise, CompletedSet, CompletedWorkout, CompletedWorkouts, DetailedWorkout,
};
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

    ///gets all the detailed information of a completed session, even if it's either a timed or weighted session.
    fn get_by_id(&self, session_id: &str) -> Result<DetailedWorkout, Error> {
        self.db.use_conn(|tx| {
            let mut stmt = tx.prepare(
                "
                SELECT w.Uuid,w.Name, wh.sessionId, wh.started_at, wh.completed_at
                FROM workoutHistory wh
                INNER JOIN Workouts w ON wh.workoutId = w.Uuid
                WHERE wh.sessionId = ?1
            ",
            )?;

            let mut workout = stmt.query_one([&session_id], |row| {
                Ok(DetailedWorkout {
                    workout_uuid: row.get(0)?,
                    workout_name: row.get(1)?,
                    session_uuid: row.get(2)?,
                    start_time: row.get(3)?,
                    end_time: row.get(4)?,
                    exercises: vec![],
                })
            })?;

            let mut stmt = tx.prepare(
                "
            SELECT ce.exerciseId , ex.name, ex.gifUrl, ex.bodyParts, ce.ID
            FROM completedExercises ce
            INNER JOIN exercises ex ON ex.exerciseId = ce.exerciseId
            WHERE ce.sessionId = ?1
            ",
            )?;

            let exercises_iter = stmt.query_map([&session_id], |row| {
                Ok(CompletedExercise {
                    exercise_id: row.get(0)?,
                    name: row.get(1)?,
                    gif_url: row.get(2)?,
                    body_part: row.get(3)?,
                    completed_id: row.get(4)?,
                    sets: vec![],
                })
            })?;

            let mut exercises = Vec::new();

            for ex in exercises_iter {
                let mut ex = ex?;

                let sets = if ex.body_part.contains("cardio") {
                    load_cardio_set(tx, &ex.completed_id)?
                } else {
                    load_weighted_set(tx, &ex.completed_id)?
                };

                ex.sets = sets;
                exercises.push(ex);
            }

            workout.exercises = exercises;
            // Response
            Ok(workout)
        })
    }
}

fn load_cardio_set(tx: &Transaction, set_id: &String) -> Result<Vec<CompletedSet>, Error> {
    let mut stmt = tx.prepare(
        "SELECT time,distance FROM completedCardioExercises WHERE completedExerciseId=?1",
    )?;

    let set_iter = stmt.query_map(&[&set_id], |row| {
        Ok(CompletedSet::Timed {
            time: row.get(0)?,
            distance: row.get(1)?,
        })
    })?;

    let sets: Result<Vec<CompletedSet>, Error> = set_iter.collect();

    Ok(sets?)
}

fn load_weighted_set(tx: &Transaction, set_id: &String) -> Result<Vec<CompletedSet>, Error> {
    let mut stmt = tx
        .prepare("SELECT reps,weight FROM completedWeightExercises WHERE completedExerciseId=?1")?;

    let set_iter = stmt.query_map(&[&set_id], |row| {
        Ok(CompletedSet::Weighted {
            reps: row.get::<_, f64>(0)?,
            weight: row.get::<_, f64>(1)?,
        })
    })?;

    let sets: Result<Vec<CompletedSet>, Error> = set_iter.collect();

    Ok(sets?)
}
