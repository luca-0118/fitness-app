use crate::api::{ApiError, ApiErrorResponse};
use crate::domain::{
    CreateWorkoutParams, Exercise, ExerciseRepo, Exercises, Workout, WorkoutExerciseRepo,
    WorkoutRepo, Workouts,
};
use crate::repository::exercise_repository::ExerciseRepository;
use crate::repository::workout_exercise_repository::WorkoutExerciseRepository;
use crate::repository::workout_repository::WorkoutRepository;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use std::collections::HashMap;


pub struct WorkoutService {
    workout: WorkoutRepository,
    exercises: ExerciseRepository,
    workout_exercises: WorkoutExerciseRepository,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct CreateWorkoutRequest {
    pub uuid: String,
    pub name: String,
    pub desc: Option<String>,
    pub exercises: Option<HashMap<String,i64>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WorkoutListParams {
    pub page_size: Option<i32>,
    pub page: Option<i32>,
    pub filter: Option<String>,
    pub query: Option<String>,
}

impl WorkoutService {
    pub fn new(
        workout_repo: WorkoutRepository,
        exercise_repository: ExerciseRepository,
        workout_exercise_repository: WorkoutExerciseRepository,
    ) -> Self {
        Self {
            workout: workout_repo,
            exercises: exercise_repository,
            workout_exercises: workout_exercise_repository,
        }
    }

    pub fn delete_workout(&self, workout_id: String) -> Result<bool, ApiErrorResponse> {
        let is_updated = self.workout.remove(workout_id).map_err(|e| {
            println!("{:?}", e);
            ApiError::DatabaseError
        })?;

        Ok(is_updated)
    }

    // gets the workout and connected exercises and maps it.
    pub fn get_detailed_workout(&self, workout_id: String) -> Result<Workout, ApiErrorResponse> {
        let record = self
            .workout_exercises
            .get_detailed(&workout_id)
            .map_err(|_| ApiError::DatabaseError)?;

        Ok(record)
    }

    pub fn list_workouts(&self) -> Result<Workouts, ApiErrorResponse> {
        //gets the raw records from the database
        let workout_records = self.workout.list().map_err(|_| ApiError::DatabaseError)?;

        Ok(workout_records)
    }

    pub fn list_exercises(
        &self,
        list_options: WorkoutListParams,
    ) -> Result<Exercises, ApiErrorResponse> {
        //calls the self filter.
        let page_size = list_options.page_size.unwrap_or(99999);
        let page = list_options.page.unwrap_or(1);
        let start_nr = (page - 1) * page_size;

        //gets list with either muscle filter or not based on if it's there.
        let exercises = self
            .exercises
            .list(
                page_size,
                start_nr,
                list_options.filter.as_deref(),
                list_options.query.as_deref(),
            )
            .map_err(|_| ApiError::InvalidInput)?;

        Ok(exercises)
    }

    pub fn create_workout(&self, dto: CreateWorkoutRequest) -> Result<String, ApiErrorResponse> {
        let uuid = Uuid::new_v4().to_string();

        let request = CreateWorkoutParams {
            uuid: uuid.clone(),
            name: dto.name,
            desc: dto.desc.unwrap_or_else(|| "".to_string()),
        };

        self.workout
            .create(request)
            .map_err(|_| ApiError::DatabaseError)?;

        Ok(uuid)
    }

    //creates a new workout with exercises if there are any.
    pub fn create_workout_with_exercises(
        &self,
        dto: CreateWorkoutRequest,
    ) -> Result<String, ApiErrorResponse> {
        // creates the list of exercises if they are there.
        // otherwise returns invalidInput error early.
        let exercises = dto.exercises.clone().ok_or(ApiError::InvalidInput)?;

        let uuid = self
            .create_workout(dto.clone())
            .map_err(|_| ApiError::DatabaseError)?;

        self.workout_exercises
            .link(uuid.clone(), exercises.clone())
            .map_err(|e| {
                println!("{:?}", e);
                ApiError::DatabaseError
            })?;

        Ok(uuid)
    }
}
