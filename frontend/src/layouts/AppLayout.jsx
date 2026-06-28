import { NavLink, Outlet } from "react-router-dom";
import { BookOpen, Home, Map } from "lucide-react";

export function AppLayout() {
  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">EduQuest Adventures</p>
          <h1>Lena's EduQuest Adventure</h1>
        </div>

        <nav>
          <NavLink to="/treehouse">
            <Home size={18} /> Tree House
          </NavLink>
          <NavLink to="/map">
            <Map size={18} /> Map
          </NavLink>
          <NavLink to="/reading">
            <BookOpen size={18} /> Reading Forest
          </NavLink>
        </nav>
      </header>

      <Outlet />
    </div>
  );
}