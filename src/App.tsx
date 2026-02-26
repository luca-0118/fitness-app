
import GreenAddButton from "./components/GreenAddButton.tsx";
import "./App.css";
import Header from "./components/Header.tsx";
import BottomNavBar from "./components/BottomNavBar.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.tsx";
import WorkoutOverview from "./pages/WorkoutOverview.tsx";
import EditWorkout from "./pages/EditWorkout.tsx";
import AddExercises from "./pages/AddExercises.tsx";
import Session from "./pages/Session.tsx";
import NewWorkout from "./pages/NewWorkout.tsx";
import Profile from "./pages/Profile.tsx";
import WorkoutHistory from "./pages/WorkoutHistory.tsx";
import SessionHistory from "./pages/SessionHistory.tsx";

function App() {
  return (
    <BrowserRouter>
      <>
        <Header/>
        <main>
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
          </Routes>
          <GreenAddButton/>
        </main>
      </>
      <BottomNavBar/>
    </BrowserRouter>
  );
}



export default App;
