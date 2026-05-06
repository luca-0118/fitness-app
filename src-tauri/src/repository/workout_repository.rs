use crate::domain::{CreateWorkoutParams, Workout};
use crate::domain::{WorkoutRepo, Workouts};
use crate::infrastructures;
use crate::infrastructures::sqlite::Db;
use rusqlite::Error;

pub struct WorkoutRepository {
    db: infrastructures::sqlite::Db,
}

impl WorkoutRepo for WorkoutRepository {
    fn new(db: Db) -> Self {
        Self { db }
    }

    fn remove(&self, workout_id: String) -> Result<bool, Error> {
        self.db
            .use_conn(|tx| tx.execute("DELETE FROM Workouts WHERE Uuid = ?1", [workout_id]))?;

        Ok(true)
    }

    fn list(&self) -> Result<Workouts, Error> {
        self.db.use_conn(|tx| {
            let mut stmt = tx.prepare("SELECT * FROM Workouts")?;

            let rows = stmt.query_map([], |row| {
                Ok(Workout {
                    uuid: row.get(1)?,
                    name: row.get(2)?,
                    desc: row.get(3)?,
                    exercises: Vec::new(),
                })
            })?;

            rows.collect()
        })
    }

    fn create(&self, create_workout_dto: CreateWorkoutParams) -> Result<bool, Error> {
        self.db.use_conn(|tx| {
            tx.execute(
                "INSERT INTO Workouts(Uuid,Name,Desc) VALUES (?, ?, ?)",
                [
                    create_workout_dto.uuid,
                    create_workout_dto.name,
                    create_workout_dto.desc,
                ],
            )
        })?;

        Ok(true)
    }
}
