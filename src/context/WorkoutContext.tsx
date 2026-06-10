import {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  useMemo,
} from "react";

interface WorkoutContextProps {
  workoutName: string;
  setWorkoutName: (name: string) => void;

  exercises: Iworkout[];

  addExercise: (workout: Iworkout) => void;
  removeExercise: (workout: Iworkout) => void;

  clearWorkout: () => void;

  selectedWorkout: string;
  setSelectedWorkout: (value: SetStateAction<string>) => void;

  selectedIds: Set<string>;

  setExerciseList: (workouts: Iworkout[]) => void;

  draftExercises: Iworkout[];
  setDraftExercises: React.Dispatch<React.SetStateAction<Iworkout[]>>;

  beginExerciseEdit: () => void;
  saveExerciseEdit: () => void;
  discardExerciseEdit: () => void;

  draftSelectedIds: Set<string>;
}

const WorkoutContext = createContext<WorkoutContextProps | undefined>(
    undefined
);

export type Iworkout = {
  id: string;
  name: string;
  gif: string;
};

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<Iworkout[]>([]);       // saved
  const [draftExercises, setDraftExercises] = useState<Iworkout[]>([]); // editing
  const [selectedWorkout, setSelectedWorkout] = useState("");

  const addExercise = (workout: Iworkout) => {
    setExercises(prev => [...prev, workout]);
  };

  const removeExercise = (workout: Iworkout) => {
    setExercises(prev =>
        prev.filter(ex => ex.id !== workout.id)
    );
  };

  const setExerciseList = (workouts: Iworkout[]) => {
    setExercises(workouts);
  };

  const clearWorkout = () => {
    setWorkoutName("");
    setExercises([]);
  };

  const selectedIds = useMemo(
      () => new Set(exercises.map(e => e.id)),
      [exercises]
  );

  const beginExerciseEdit = () => {
    setDraftExercises([...exercises]);
  };

  const saveExerciseEdit = () => {
    setExercises([...draftExercises]);
  };

  const discardExerciseEdit = () => {
    setDraftExercises([...exercises]);
  };

  const draftSelectedIds = useMemo(
      () => new Set(draftExercises.map(e => e.id)),
      [draftExercises]
  );


  return (
      <WorkoutContext.Provider
          value={{
            workoutName,
            setWorkoutName,
            exercises,
            addExercise,
            removeExercise,
            clearWorkout,
            selectedWorkout,
            setSelectedWorkout,
            selectedIds,
            setExerciseList,
            beginExerciseEdit,
            saveExerciseEdit,
            discardExerciseEdit,
            draftSelectedIds,
            draftExercises,
            setDraftExercises,
          }}
      >
        {children}
      </WorkoutContext.Provider>
  );
}

export function useWorkout(): WorkoutContextProps {
  const context = useContext(WorkoutContext);

  if (!context) {
    throw new Error(
        "useWorkout must be used within WorkoutProvider"
    );
  }

  return context;
}