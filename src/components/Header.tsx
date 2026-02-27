import { useLocation } from "react-router-dom";
// Map of URL paths to page titles
const pageTitles: Record<string, string> = {
  "/": "Home",
  "/workouts": "Workout Overview",
  "/edit-workout": "Edit Workout",
  "/add-exercises": "Add Exercises",
  "/session": "Session",
  "/new-workout": "New Workout",
  "/profile": "Profile",
  "/history": "Workout History",
  "/session-history": "Session History",
  "/kcal-tracker": "Calorie Tracker",
  "/exercises": "Exercises",
  "/exercise-description": "Exercise Description",
};
// This component will display the title of the current page based on the URL path
export default function Header() {
  const location = useLocation();
// Get the title for the current path, or default to "Page" if not found
  const title = pageTitles[location.pathname] || "Page";

  
    return (
        <header className="z-40 pt-4 shrink-0">
          <div className="w-[90%] mx-auto text-center bg-[#161818]">
            <h1 className="text-[24px] font-bold text-[#F2F3F2]">
              {title}
            </h1>

            <div className="border-b-2 border-white mt-2"></div>
          </div>
        </header>
    )
}