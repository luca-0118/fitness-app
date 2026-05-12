import { NavLink, Outlet } from "react-router-dom";

export default function FoodPage() {
  return (
    <div className="">
      <div className="">
        <nav className="flex justify-center gap-10 text-textcolor border-2">
          <NavLink to="/food-page">All products</NavLink>
          <NavLink to="custom-food">Created by me</NavLink>
        </nav>
      </div>
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  )
}