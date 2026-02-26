import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.tsx";
import BottomNavBar from "./components/BottomNavBar.tsx";

import Home from "./pages/Home.tsx";
import WorkoutOverview from "./pages/WorkoutOverview.tsx";
import EditWorkout from "./pages/EditWorkout.tsx";
import AddExercises from "./pages/AddExercises.tsx";
import Session from "./pages/Session.tsx";
import NewWorkout from "./pages/NewWorkout.tsx";
import Profile from "./pages/Profile.tsx";
import WorkoutHistory from "./pages/WorkoutHistory.tsx";
import SessionHistory from "./pages/SessionHistory.tsx";
import KcalTracker from "./pages/KcalTracker.tsx";
import Exercises from "./pages/Exercises.tsx";
import ExerciseDescription from "./pages/ExerciseDescription.tsx";

function App() {
  return (
      <BrowserRouter>
        <div className="h-dvh flex flex-col overflow-hidden">
          <Header />
            <main className="flex-1 overflow-y-auto px-4 no-scrollbar">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/workouts" element={<WorkoutOverview />} />
                <Route path="/edit-workout" element={<EditWorkout />} />
                <Route path="/add-exercises" element={<AddExercises />} />
                <Route path="/session" element={<Session />} />
                <Route path="/new-workout" element={<NewWorkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/history" element={<WorkoutHistory />} />
                <Route path="/session-history" element={<SessionHistory />} />
                <Route path="/kcal-tracker" element={<KcalTracker />} />
                <Route path="/exercises" element={<Exercises  />} />
                <Route path="/exercise-description" element={<ExerciseDescription />} />
              </Routes>
          </main>
          <BottomNavBar/>
        </div>
      </BrowserRouter>
  );
}


export default App;