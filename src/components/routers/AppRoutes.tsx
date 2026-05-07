import {Route, Routes} from "react-router-dom";
import Home from "../../pages/Home.tsx";
import Profile from "../../pages/Profile.tsx";
import KcalTracker from "../../pages/food/KcalTracker.tsx";
import WorkoutRoutes from "./WorkoutRoutes.tsx";
import SessionPage from "../../pages/session/SessionPage.tsx";

const APP_ROUTES = {
    HOME: "/",
    PROFILE: "/profile",
    CAL_TRACKER: "/kcal-tracker",
    WORKOUTS: "/workout/*",
    SESSION: "/session"
}


/**
 * Contains all the routes for our apps.
 * Routes that are part of other parts of the app are under sub-routers. (example: WorkoutRoutes)
 * @constructor
 */
export default function AppRoutes() {
    return<Routes>
        <Route path={APP_ROUTES.HOME} element={<Home />} />
        <Route path={APP_ROUTES.PROFILE} element={<Profile />} />
        <Route path={APP_ROUTES.CAL_TRACKER} element={<KcalTracker />} />
        <Route path={APP_ROUTES.WORKOUTS} element={<WorkoutRoutes/>} />
        <Route path={APP_ROUTES.SESSION} element={<SessionPage/>} />
    </Routes>
}