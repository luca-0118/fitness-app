import React from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantSharpIcon from '@mui/icons-material/RestaurantSharp';
import HomeSharpIcon from '@mui/icons-material/HomeSharp';

export default function BottomNavBar() {
    return (
        <footer className="fixed bottom-0 z-10 h-22 w-full bg-[#333737] border-t-2 border-[#565d5d]">
            <nav className="grid grid-cols-4 h-full max-w-sm mx-auto">
                <Link to="/" className="inline-flex flex-col items-center">
                    <HomeSharpIcon sx={{ fontSize: 40 }}/>
                    <p className="text-xs">Home</p>
                </Link>
                <Link to="/workouts" className="inline-flex flex-col items-center">
                    <FitnessCenterIcon sx={{ fontSize: 40 }}/>
                    <p className="text-xs">Workout</p>
                </Link>
                <Link to="/kcal-tracker" className="inline-flex flex-col items-center">
                    <RestaurantSharpIcon sx={{ fontSize: 40 }}/>
                    <p className="text-xs">Kcal</p>
                </Link>
                <Link to="/profile" className="inline-flex flex-col items-center">
                    <PersonSharpIcon sx={{ fontSize: 40 }}/>
                    <p className="text-xs">Profile</p>
                </Link>
            </nav>
        </footer>
    )
}