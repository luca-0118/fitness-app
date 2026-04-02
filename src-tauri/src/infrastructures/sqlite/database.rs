use std::sync::Mutex;
use rusqlite::{Connection, Error, Transaction};
use std::sync::Arc;

#[derive(Clone)]
pub struct Db {
    pub conn: Arc<Mutex<Connection>>
    
}

impl Db {
    pub fn new(_conn: Connection) -> Self {
        Self {
            conn: Arc::new(Mutex::new(_conn))
        }
    }

    //This function is like a foreach, F is the function we're passing and
    //T is the return type of that function.
    // Basically, write you function like you do a map function in Rust, and just put the executions in there.
    // it helps so 1. we always have transactions 2. keeps database connections singular.
    pub fn use_conn<F,T>(&self, f: F) -> Result<T,Error>
    //the were explains what kind of function F is.
    // it's a function that fires once, has a transaction struct and returns the type of the func.
    where F: FnOnce(&Transaction) -> Result<T, Error>
     {
        let mut conn = self.conn.lock().expect("lock is contaminated");

        let tx = conn.transaction()?;

        //we then here fire said function. and grab the result aka T.
        let result = f(&tx)?;
        
        tx.commit()?;
        Ok(result)
    }
}