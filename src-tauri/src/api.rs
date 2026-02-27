use serde::Serialize;
use thiserror::Error;
#[derive(Serialize)]
pub struct ApiResponse<T>
where
    T: Serialize,
{
    pub ok: bool,
    pub data: T,
}
#[derive(Serialize)]
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
}

impl From<ApiError> for ApiErrorResponse {
    fn from(err: ApiError) -> Self {
        ApiErrorResponse {
            ok: false,
            error_type: format!("{:?}", err),
            message: err.to_string(),
        }
    }
}
