import { useLocation, useNavigate } from "react-router-dom";
import SaveButton from "./SaveButton.tsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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

const routesWithSave = [
  "/edit-workout",
  "/new-workout",
];

// This component will display the title of the current page based on the URL path
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
// Get the title for the current path, or default to "Page" if not found
  const title = pageTitles[location.pathname] || "Page";

  const showSave = routesWithSave.includes(location.pathname);
  const showBack = location.pathname !== "/";

    return (
        <header className="z-40 pt-6 shrink-0 w-[90%] mx-auto">
          <div className="relative flex items-center">
            {showBack && (
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-0 cursor-pointer"
                >
                  <ArrowBackIcon sx={{ fontSize: 32 }} />
                </button>
            )}
            <h1 className="text-[24px] font-bold text-[#F2F3F2] mx-auto">
              {title}
            </h1>
            {showSave && (
                <div className="absolute right-0">
                  <SaveButton />
                </div>
            )}
          </div>
            <div className="border-b-2 border-[#414141] mt-2"></div>
        </header>
    )
}