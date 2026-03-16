use std::sync::Mutex;
use crate::SessionState;

pub fn start(session: &SessionState, session_state: tauri::State<Mutex<SessionState>>) -> bool {
   let mut session_state = session_state.lock().unwrap();
    *session_state = session.clone();
    return true;
}
pub fn get(session_state: tauri::State<Mutex<SessionState>>) -> SessionState {
    let session_state = session_state.lock().unwrap();
    session_state.clone()
}