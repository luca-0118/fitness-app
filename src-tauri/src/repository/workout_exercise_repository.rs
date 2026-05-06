use crate::domain::Workout;
use crate::domain::{Exercise, WorkoutExerciseRepo};
use crate::infrastructures;
use crate::infrastructures::sqlite::Db;
use rusqlite::{params_from_iter, Error};
pub struct WorkoutExerciseRepository {
    db: infrastructures::sqlite::Db,
}

impl WorkoutExerciseRepo for WorkoutExerciseRepository {
    fn new(db: Db) -> Self {
        Self { db }
    }

    fn get_detailed(&self, workout_id: &str) -> Result<Workout, Error> {
        self.db.use_conn(|tx| {
            let mut workout_stmt = tx.prepare("SELECT Uuid,Name,Desc FROM Workouts WHERE Uuid = ?")?;

            let workout_row = workout_stmt.query_map([workout_id], |row| {
                Ok(Workout {
                    uuid: row.get(0)?,
                    name: row.get(1)?,
                    desc: row.get(2)?,
                    exercises: Vec::new(),
                })
            })?;

            let workout_vec: Vec<Workout> = workout_row.collect::<Result<Vec<_>, _>>()?;
            let workout = workout_vec
                .get(0)
                .cloned()
                .ok_or(rusqlite::Error::InvalidQuery)?;

            let mut exercises_stmt = tx.prepare("SELECT e.* FROM Exercises e
                                                               INNER JOIN WorkoutExercises we ON e.exerciseid = we.ExerciseId
                                                               WHERE we.WorkoutId = ?
                                                               ORDER BY we.orderNr ASC")?;
            let exercise_rows = exercises_stmt.query_map([workout_id], |row| {
                Ok(Exercise{
                    exercise_id: row.get(0)?,
                    name: row.get(1)?,
                    gif_url: row.get(2)?,
                    target_muscles: row.get(3)?,
                    body_parts: row.get(4)?,
                    equipments: row.get(5)?,
                    secondary_muscles: row.get(6)?,
                    instructions: row.get(7)?,
                })
            })?;

            Ok(Workout{
                uuid: workout.uuid,
                name: workout.name,
                desc: workout.desc,
                exercises: exercise_rows.collect::<Result<Vec<_>, _>>()?,
            })

        })
    }

    // links exercises in a single bulk query.
    fn link(&self, workout_id: String, exercise_ids: Vec<String>) -> Result<bool, Error> {
        //roundabout way to fix an issue where I
        // can't reuse the i to add a numbering for the order of workouts.
        let order_strs: Vec<String> = (0..exercise_ids.len()).map(|i| i.to_string()).collect();

        self.db.use_conn(|tx| {
            let mut query = String::from(
                "INSERT INTO WorkoutExercises (WorkoutId, ExerciseId,orderNr) VALUES ",
            );

            let mut params_vec = Vec::new();

            exercise_ids
                .iter()
                .enumerate()
                .for_each(|(i, exercise_id)| {
                    if i > 0 {
                        query.push_str(", ");
                    }
                    query.push_str("(?, ?, ?)");
                    params_vec.push(&workout_id);
                    params_vec.push(exercise_id);
                    params_vec.push(&order_strs[i]);
                });

            tx.execute(&query, params_from_iter(params_vec))?;

            Ok(())
        })?;

        Ok(true)
    }
}
