use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::api::{ApiError, ApiErrorResponse};
use crate::domain::{WorkoutRepo, Workouts, Workout, WorkoutExerciseRepo, Exercises, ExerciseRepo, CreateWorkoutParams};
use crate::repository::exercise_repository::ExerciseRepository;
use crate::repository::workout_exercise_repository::WorkoutExerciseRepository;
use crate::repository::workout_repository::WorkoutRepository;

pub struct WorkoutService {
    workout: WorkoutRepository,
    exercises: ExerciseRepository,
    workout_exercises: WorkoutExerciseRepository
}

#[derive(Clone,Serialize,Deserialize)]
pub struct CreateWorkoutRequest {
    pub uuid: String,
    pub name: String,
    pub desc: Option<String>,
    pub exercises: Option<Vec<String>>,
}



impl WorkoutService {

    pub fn new(workout_repo: WorkoutRepository, exercise_repository: ExerciseRepository, workout_exercise_repository: WorkoutExerciseRepository) -> Self {
        Self {
            workout: workout_repo,
            exercises: exercise_repository,
            workout_exercises: workout_exercise_repository
        }
    }

    // gets the workout and connected exercises and maps it.
    pub fn get_detailed_workout(&self,workout_id: String) -> Result<Workout,ApiErrorResponse> {
        let record = self.workout_exercises.get_detailed(&workout_id).map_err(|_| ApiError::DatabaseError)?;

        Ok(record)
    }

    pub fn list_workouts(&self) -> Result<Workouts, ApiErrorResponse> {
        //gets the raw records from the database
        let workout_records = self.workout.list().map_err(|_| ApiError::DatabaseError)?;

        Ok(workout_records)
    }
    pub fn list_exercises(&self) -> Result<Exercises, ApiErrorResponse> {
        let exercise_records = self.exercises.list().map_err(|e| {
            println!("{:?}", e);
            ApiError::DatabaseError
        })?;

        Ok(exercise_records)
    }

    pub fn filter_exercises(&self,muscle_group: String) -> Result<Exercises, ApiErrorResponse> {
        let filtered_exercises = self.exercises.filtered_list(&muscle_group).map_err(|_| ApiError::DatabaseError)?;


        Ok(filtered_exercises)
    }

    pub fn create_workout(&self, dto: CreateWorkoutRequest) -> Result<String, ApiErrorResponse> {
        let uuid = Uuid::new_v4().to_string();

        let request = CreateWorkoutParams{
            uuid: uuid.clone(),
            name: dto.name,
            desc: dto.desc.unwrap_or_else(|| "".to_string()),
        };

        self.workout.create(request).map_err(|_| ApiError::DatabaseError)?;

        Ok(uuid)
    }

    //creates a new workout with exercises if there are any.
    pub fn create_workout_with_exercises(&self, dto: CreateWorkoutRequest) -> Result<String, ApiErrorResponse> {
        // creates the list of exercises if they are there.
        // otherwise returns invalidInput error early.
        let exercises = dto
            .exercises
            .clone()
            .ok_or(ApiError::InvalidInput)?;

        let uuid = self.create_workout(dto.clone()).map_err(|_| ApiError::DatabaseError)?;

        self.workout_exercises.link(uuid.clone(), exercises.clone()).map_err(|e| {
            println!("{:?}", e);
            ApiError::DatabaseError
        })?;

        Ok(uuid)
    }
}