import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Home",
  "/workouts": "Workout Overview",
  "/edit-workout": "Edit Workout",
  "/add-exercises": "Add Exercises",
  "/session": "Session",
  "/new-workout": "New Workout",
  "/profile": "Profile",
  "/history": "Workout History",
};

export default function Header() {
  const location = useLocation();

  const title = pageTitles[location.pathname] || "Page";

   
    return (
        <header className="text-[24px] font-bold text-[#F2F3F2] border-b-2 border-white text-center mx-auto py-2 w-[80%]">
            <h1>{title}</h1>
        </header>
    
    )
}
// ¯\_(ツ)_/¯