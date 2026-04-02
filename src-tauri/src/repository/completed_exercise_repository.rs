use rusqlite::Error;
use uuid::Uuid;

use crate::{domain::{AddExerciseParams, AddTimedSetParams, AddWeighedSetParams, CompletedExerciseRepo}, infrastructures::sqlite::Db};

pub struct CompletedExerciseRepository {
    pub db: Db,
}

impl CompletedExerciseRepo for CompletedExerciseRepository {
    fn new(db :Db ) -> Self {
        Self { db }
    }

    fn add_timed_set(&self,req: AddTimedSetParams) -> Result<String,Error> {
        self.db.use_conn(|tx| {
            tx.execute("INSERT INTO completedCardioExercises(completedExerciseId,time,distance) VALUES(?1,?2,?3)",[
                req.completed_exercise_id,
                req.time.to_string(),
                req.distance.to_string()
            ])
        })?;
        
        Ok("fakka".to_string())
    }

    fn add_weighted_set(&self,req: AddWeighedSetParams) -> Result<String,Error> {
        self.db.use_conn(|tx| {
            tx.execute("INSERT INTO completedWeightExercises(completedExerciseId,reps,weight) VALUES(?1,?2,?3)",[
                req.completed_exercise_id,
                req.reps.to_string(),
                req.weight.to_string()
            ])
        })?;
        
        Ok("fakka".to_string())
    }

    fn add_exercise(&self, req: AddExerciseParams) -> Result<String,Error> {
        let history_id = Uuid::new_v4().to_string();

        self.db.use_conn(|tx| {
            tx.execute("INSERT INTO completedExercises(ID,sessionId,ExerciseID) VALUES(?1,?2,?3)", [&history_id,&req.session_id.clone(),&req.exercise_id.clone()])
        })?;

        Ok(history_id)
    }
}