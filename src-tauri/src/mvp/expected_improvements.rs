use std::{collections::HashMap, hash::Hash};

use tauri::State;

use crate::{
    mvp::{DataPoint, LinearRegression},
    Ctx,
};

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

    println!("printing currently sorted sets: {:?}", &grouped_sets);

    let _e1rms = get_highest_volumes(&grouped_sets);

    println!("list of e1rms for exercise {:?}: {:?}", exercise_id, _e1rms);

    let next_value = plot_regression(_e1rms);

    println!("the next possible e1RM will be {:?}", next_value);
    println!("");
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
fn get_highest_volumes(grouped_sets: &HashMap<String, Vec<CompletedExercise>>) -> Vec<f64> {
    let mut e1rm_points: Vec<f64> = Vec::new();

    //sorts the keys into alphabetical order.
    let mut keys: Vec<&String> = grouped_sets.keys().collect();
    keys.sort();

    for exercise_key in keys {
        let set_list = grouped_sets.get(exercise_key).expect("could not find sets");

        let mut highest_val: f64 = 0.0;

        //checks each set done in a session, calculating the e1rm.
        //stores the highest value in highest_val.
        for set in set_list.iter() {
            let e1rm = calc_e1rm(set);

            if e1rm > highest_val {
                highest_val = e1rm
            };
        }

        // pushes the highest e1rm from a set done in a session.
        e1rm_points.push(highest_val);
    }

    e1rm_points
}

// Plot in regression
fn plot_regression(data_points: Vec<f64>) -> f64 {
    let mut nr = 0.0;
    let mut mapped_points: Vec<DataPoint> = Vec::new();

    for point in data_points {
        mapped_points.push(DataPoint {
            x: nr,
            y: point,
            weight: 1.0,
        });

        nr += 1.0;
    }

    let lin_reg = LinearRegression::fit(&mapped_points);

    // Estimate next highest value
    nr += 1.0;

    let next = lin_reg.predict(nr);

    next
}

fn calc_e1rm(exercise: &CompletedExercise) -> f64 {
    round_decimals(exercise.weight * (1_f64 + (30_f64 / exercise.reps)))
}

fn round_decimals(number: f64) -> f64 {
    (number * 100_f64).round() / 100_f64
}
