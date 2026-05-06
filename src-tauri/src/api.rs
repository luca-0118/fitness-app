use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Serialize)]
pub struct ApiResponse<T>
where
    T: Serialize,
{
    pub ok: bool,
    pub data: T,
}
#[derive(Debug, Serialize)]
pub struct ApiErrorResponse {
    pub ok: bool,
    #[serde(rename = "type")]
    pub error_type: String,
    pub message: String,
}

#[derive(Error, Debug)]
pub enum ApiError {
    #[error("invalid input")]
    InvalidInput,

    #[error("database error")]
    DatabaseError,

    #[error(transparent)]
    Sqlite(#[from] rusqlite::Error),

    #[error("Lock is poisoned")]
    PoisonedLock,

    #[error("No session has been found")]
    SessionNotFound,

    #[error("session could not be saved")]
    SessionNotSaved,

    #[error("Could not save exercise")]
    ExerciseNotSaved,

    #[error("Could not save set")]
    SetNotSaved,
}

impl From<ApiError> for ApiErrorResponse {
    fn from(err: ApiError) -> Self {
        println!("{:?}", err);
        ApiErrorResponse {
            ok: false,
            error_type: format!("{:?}", err),
            message: err.to_string(),
        }
    }
}
