import { NavLink } from "react-router-dom";
import PersonSharpIcon from "@mui/icons-material/PersonSharp";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantSharpIcon from "@mui/icons-material/RestaurantSharp";
import HomeSharpIcon from "@mui/icons-material/HomeSharp";

export default function BottomNavBar() {
    return (
        <footer className="relative bottom-0 z-48 py-2 w-full bg-navbar border-t-2 border-bordercolor">
            <nav className="h-full max-w-sm mx-auto justify-evenly flex">
                <NavLink to="/" className={({ isActive }) => `text-center items-center ${isActive ? 'text-accent' : 'text-icons'}`}>
                    <HomeSharpIcon sx={{ fontSize: 40 }}/>
                    <p className="text-xs">Home</p>
                </NavLink>
                <NavLink to="/workouts" className={({ isActive }) => `text-center items-center ${isActive ? 'text-accent' : 'text-icons'}`}>
                    <FitnessCenterIcon sx={{ fontSize: 40 }}/>
                    <p className="text-xs">Workout</p>
                </NavLink>
                <NavLink to="/kcal-tracker" className={({ isActive }) => `text-center items-center ${isActive ? 'text-accent' : 'text-icons'}`}>
                    <RestaurantSharpIcon sx={{ fontSize: 40 }}/>
                    <p className="text-xs">Kcal</p>
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `text-center items-center ${isActive ? 'text-accent' : 'text-icons'}`}>
                    <PersonSharpIcon sx={{ fontSize: 40 }}/>
                    <p className="text-xs">Profile</p>
                </NavLink>
            </nav>
        </footer>
    )
}

//code heeft veel repetitie (basically zelfde code), ik ga kijken als ik dit later netter kan maken. maar voor nu hebben we iets
