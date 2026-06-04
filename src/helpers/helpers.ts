interface Macros {
    carbs: number;
    fats: number;
    proteins: number;
    calories: number;
}

/// calc is short for calculate btw
/// calcultes the new proteins, carbs,fats and calories from the previous values to the new value.
export function calcIntake(_currentIntake:number,_newIntake: number,{carbs,fats,proteins,calories}:Macros) {
    const singleCarb = carbs / _currentIntake;
    const singleFat = fats / _currentIntake;
    const singleProtein = proteins / _currentIntake;
    const singleCalorie = calories / _currentIntake;

    return {
        carbs: singleCarb * _newIntake,
        fats: singleFat * _newIntake,
        proteins: singleProtein * _newIntake,
        calories: singleCalorie * _newIntake,
    }
}