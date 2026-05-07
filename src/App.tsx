import "./App.css";
import { BrowserRouter} from "react-router-dom";
import Header from "./components/ui/Header.tsx";
import BottomNavBar from "./components/ui/BottomNavBar.tsx";
import { WorkoutProvider } from "./context/WorkoutContext";
// import FoodList from "./pages/FoodList.tsx"
// import Home from "./pages/Home.tsx";
// import WorkoutOverviewPage from "./pages/WorkoutOverviewPage.tsx";
// import EditWorkout from "./pages/EditWorkout.tsx";
// import ExerciseOverviewPage from "./pages/ExerciseOverviewPage.tsx";
// import SessionPage from "./pages/SessionPage.tsx";
// import CreateWorkoutPage from "./pages/CreateWorkoutPage.tsx";
// import Profile from "./pages/Profile.tsx";
// import WorkoutHistoryPage from "./pages/WorkoutHistoryPage.tsx";
// import SessionHistory from "./pages/SessionHistory.tsx";
// import KcalTracker from "./pages/KcalTracker.tsx";
// import WorkoutDetailPage from "./pages/WorkoutDetailPage.tsx";
// import ExerciseDescription from "./pages/ExerciseDescription.tsx";
// import ProductDetails from "./pages/ProductDetails.tsx";
import { Toaster } from "react-hot-toast";
import FloatingWorkoutTimer from "./components/FloatingWorkoutTimer.tsx";
import useWorkoutOverlayCloser from "./Hooks/useWorkoutOverlayCloser.ts";
import AppRoutes from "./components/routers/AppRoutes.tsx";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";

function App() {
    useWorkoutOverlayCloser();
    const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <WorkoutProvider>
        <BrowserRouter>
          <div className="h-dvh flex flex-col overflow-hidden">
            <Header />
            <main className="flex flex-col flex-1 min-h-0 relative no-scrollbar bg-background">
              <Toaster position="top-center" reverseOrder={false} />

              {/*<Routes>*/}
              {/*  <Route path="/edit-workout" element={<EditWorkout />} />*/}
              {/*  <Route path="/add-exercises" element={<ExerciseOverviewPage />} />*/}
              {/*  <Route path="/session" element={<SessionPage />} />*/}
              {/*  <Route path="/new-workout" element={<CreateWorkoutPage />} />*/}
              {/*  <Route path="/history" element={<WorkoutHistoryPage />} />*/}
              {/*  <Route path="/session-history" element={<SessionHistory />} />*/}
              {/*  <Route path="/exercises" element={<WorkoutDetailPage />} />*/}
              {/*  <Route path="/food-list" element={<FoodList />} />*/}
              {/*  <Route path="/exercise-description"element={<ExerciseDescription />}/>*/}
              {/*  <Route path="/product-details" element={<ProductDetails />} />*/}
              {/*</Routes>*/}
              <AppRoutes/>
            </main>
            <FloatingWorkoutTimer />
            <BottomNavBar />
          </div>
        </BrowserRouter>
      </WorkoutProvider>
    </QueryClientProvider>
  );
}

export default App;
