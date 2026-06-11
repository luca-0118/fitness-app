use std::collections::HashMap;

use tauri::State;

use crate::Ctx;

#[derive(Debug, Clone)]
struct CompletedExercise {
    pub id: f64,
    pub completed_exercise_id: String,
    pub reps: f64,
    pub weight: f64,
}

#[tauri::command]
pub fn create_predictive_graph(ctx: State<Ctx>, exercise_id: String) {
    let mut exercise_sets =
        get_exercise_sets(&ctx, &exercise_id).expect("failed to get exercise sets");
    // println!("printing current data: {:?}", exercise_sets);

    let grouped_sets = group_exercise_sets(&mut exercise_sets);

    println!("printing currently sorted sets: {:?}", grouped_sets);
}

// Get all sets done of an exercise
fn get_exercise_sets(
    ctx: &Ctx,
    compl_exerc_id: &str,
) -> Result<Vec<CompletedExercise>, rusqlite::Error> {
    ctx.db.use_conn(|tx| {
        let mut stmt = tx.prepare(
            "  SELECT  CWE.completedExerciseId, CWE.weight, CWE.reps,CWE.ID
                    FROM completedWeightExercises CWE
                    INNER JOIN completedExercises CE ON CE.ID = CWE.completedExerciseId
                    WHERE CE.exerciseId = ?1
                    ORDER BY completedExerciseId desc",
        )?;

        let resp = stmt.query_map([compl_exerc_id], |row| {
            Ok(CompletedExercise {
                id: row.get(3)?,
                completed_exercise_id: row.get(0)?,
                reps: row.get(1)?,
                weight: row.get(2)?,
            })
        })?;

        let data: Vec<CompletedExercise> = resp.collect::<Result<Vec<_>, _>>()?;
        Ok(data)
    })
}

// Group all exercises to sets
fn group_exercise_sets(
    sets: &mut Vec<CompletedExercise>,
) -> HashMap<String, Vec<CompletedExercise>> {
    let mut map: HashMap<String, Vec<CompletedExercise>> = HashMap::new();

    for set in sets.iter_mut() {
        //if a map already has the key we're looping for, add the entry to it.
        if map.contains_key(&set.completed_exercise_id) {
            let exercise_id: &mut Vec<CompletedExercise> = map
                .get_mut(&set.completed_exercise_id)
                .expect("could not find exercise id");
            exercise_id.push(set.clone());
        } else {
            //creates a new entry with the new id, and adds the set.
            map.insert(set.completed_exercise_id.clone(), vec![set.clone()]);
        }
    }

    return map;
}

// Get the highest e1RM
// Plot in regression
// Estimate next highest value
