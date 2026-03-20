use rusqlite::{Connection, Transaction};
use uuid::Uuid;

use crate::{Db, api, models::{SessionExercise, Set}};

#[derive(Debug)]
pub struct CompletedWorkoutDTO {
    pub session_id: String,
    pub workout_id: String,
    pub started_at: String,
    pub completed_at: String
}

pub fn add_completed_workout(conn: &mut Connection,workout: CompletedWorkoutDTO) -> bool {

    println!("inserting following struct: {:?}",workout);
    
    let result = conn.execute("INSERT INTO workoutHistory(SessionId,WorkoutId,Started_at,Completed_at) VALUES (?1,?2,?3,?4)",
    [workout.session_id,workout.workout_id,workout.started_at,workout.completed_at]);

    // returns true or false based on if the result has affected anything once.
    match result {
        Ok(rows) => rows == 1,
        Err(error) => {
            let resp = error.to_string();
            println!("error in database: {}", resp);
            return false;
        },
    }
}

pub fn add_completed_exercises(db: &mut Connection, exercises: &Vec<SessionExercise>, session_id: &String) {
    for exercise in exercises.iter() {
        let tx = db.transaction().unwrap();

        let entry_id = insert_exercise_entry(&tx, session_id, &exercise.exercise_id);

        for set in &exercise.sets {
            match set {
                Set::Weighted { reps, weight, time_completed } => {
                    insert_weighted_set(&tx, &entry_id, reps, weight, time_completed);
                }
                Set::Timed { distance, time, time_completed } => {
                    insert_cardio_set(&tx, &entry_id, time, distance, time_completed);
                }
            }
        }

        tx.commit().unwrap();
    }
}

fn insert_exercise_entry(db: &Transaction,session_id: &String, exercise_id: &String) -> String {
    let history_id = Uuid::new_v4().to_string();
    
    db.execute("INSERT INTO completedExercises(id,sessionId,ExerciseID) VALUES(?1,?2,?3)", [&history_id,&session_id.clone(),&exercise_id.clone()]).unwrap();
    
    history_id

}

fn insert_cardio_set(db: &Transaction, completed_exercise_id: &String,time: &f64,distance: &f64, time_completed: &String) -> bool {
    let response = db
    .execute("INSERT INTO completedCardioExercises(id,time,distance) VALUES(?1,?2,?3)",
     [completed_exercise_id.to_string(),
     time.clone().to_string(),
     distance.clone().to_string()]);

    match response {
        Ok(added) => added == 1,
        Err(_) => false
    }
} 

fn insert_weighted_set(db: &Transaction, completed_exercise_id: &String, reps: &i64, weight: &f64, time_completed: &String) -> bool {
        let response = db
    .execute("INSERT INTO completedWeightExercises(id,reps,weight) VALUES(?1,?2,?3)",
     [completed_exercise_id.to_string(),
     reps.clone().to_string(),
     weight.clone().to_string()]);

    match response {
        Ok(added) => added == 1,
        Err(_) => false
    }
}