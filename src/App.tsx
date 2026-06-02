import "./App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/General/ui/Header.tsx";
import BottomNavBar from "./components/General/ui/BottomNavBar.tsx";
import { WorkoutProvider } from "./context/WorkoutContext";

import FoodList from "./pages/Foodtracker/FoodList.tsx"
import Home from "./pages/General/Home.tsx";
import WorkoutOverview from "./pages/Workout/WorkoutOverview.tsx";
import EditWorkout from "./pages/Workout/EditWorkout.tsx";
import AddExercises from "./pages/Workout/AddExercises.tsx";
import Session from "./pages/Workout/Session.tsx";
import NewWorkout from "./pages/Workout/NewWorkout.tsx";
import Profile from "./pages/General/Profile.tsx";
import WorkoutHistory from "./pages/Workout/WorkoutHistory.tsx";
import SessionHistory from "./pages/Workout/SessionHistory.tsx";
import KcalTracker from "./pages/Foodtracker/KcalTracker.tsx";
import Exercises from "./pages/Workout/Exercises.tsx";
import ExerciseDescription from "./pages/Workout/ExerciseDescription.tsx";
import { Toaster } from "react-hot-toast";
import FloatingWorkoutTimer from "./components/Workout/timers/FloatingWorkoutTimer.tsx";
import API from "./classes/api";
import { SESSION_STORAGE_KEYS } from "./apis/sessionAPI";
import ProductDetails from "./pages/Foodtracker/ProductDetails.tsx";

function App() {
  useEffect(() => {
    let unlistenCloseRequested: (() => void) | undefined;
    let isClosing = false;

    const finishActiveWorkout = async () => {
      if (!localStorage.getItem(SESSION_STORAGE_KEYS.id)) return;

      try {
        await API.session.complete();
      } catch (error) {
        console.error("Failed to auto-complete workout on app close", error);
      }
    };

    const handleBeforeUnload = () => {
      void finishActiveWorkout();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const registerTauriCloseHook = async () => {
      const isTauriRuntime = "__TAURI_INTERNALS__" in window || "__TAURI__" in window;
      if (!isTauriRuntime) return;

      try {
        const { getCurrentWindow } = await import("@tauri-apps/api/window");
        const appWindow = getCurrentWindow();

        unlistenCloseRequested = await appWindow.onCloseRequested(async (event) => {
          if (isClosing) return;

          event.preventDefault();
          isClosing = true;
          await finishActiveWorkout();
          await appWindow.close();
        });
      } catch (error) {
        console.error("Failed to register Tauri close handler", error);
      }
    };

    void registerTauriCloseHook();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      unlistenCloseRequested?.();
    };
  }, []);

  return (
    <WorkoutProvider>
      <BrowserRouter>
        <div className="h-dvh flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto no-scrollbar bg-background">
            <Toaster position="top-center" reverseOrder={false} />
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
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/food-list" element={<FoodList />} />
              <Route path="/exercise-description" element={<ExerciseDescription />}/>
              <Route path="/product-details" element={<ProductDetails />} />
            </Routes>
          </main>
          <FloatingWorkoutTimer />
          <BottomNavBar />
        </div>
      </BrowserRouter>
    </WorkoutProvider>
  );
}

export default App;
