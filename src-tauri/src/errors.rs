use thiserror::Error;
use serde::Serialize;

#[derive(Error, Debug, Serialize)]
#[serde(tag = "type", content = "message")]
pub enum ApiError {
    #[error("{0}")] // the string you pass will be the message
    Custom(String),

    #[error("invalid input")]
    InvalidInput,

    #[error("database error")]
    DatabaseError,
}