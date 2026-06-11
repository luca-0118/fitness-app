import { useLocation, useNavigate } from "react-router-dom";
import SaveButton from "../buttons/SaveButton.tsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useWorkout} from "../../../context/WorkoutContext.tsx";
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
  "/food-page": "Food",
  "/food-page/food-list": "Food",
  "/food-page/custom-food": "Food",
  "/food-page/custom-food/create-meal": "Food",
  "/product-details": "Product Details",
};

const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith("/kcal-tracker/")) {
    return "Edit Food";
  }
  return pageTitles[pathname] || "Page";
};

const routesWithSave = [
  "/edit-workout",
  "/new-workout",
  "/add-exercises",
];

// This component will display the title of the current page based on the URL path
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = getPageTitle(location.pathname);

  const showSave = routesWithSave.includes(location.pathname);
  const showBack = location.pathname !== "/";

  const { discardExerciseEdit } = useWorkout();

  const handleBack = () => {
    if (location.pathname === "/add-exercises") {
      discardExerciseEdit();
    }

    navigate(-1);
  };

  return (
    <header className="z-48 pt-6 shrink-0 w-full mx-auto bg-background">
      <div className="relative flex items-center border-b-2 border-bordercolor pb-2 w-[90%] mx-auto">
        {showBack && (
          <button
            onClick={handleBack}
            className="absolute left-0 cursor-pointer text-textcolor"
          >
            <ArrowBackIcon sx={{ fontSize: 32 }} />
          </button>
        )}
        <h1 className="text-[24px] font-bold text-textcolor mx-auto">
          {title}
        </h1>
        {showSave && (
          <div className="absolute right-0">
            <SaveButton />
          </div>
        )}
      </div>
    </header>
  );
}
