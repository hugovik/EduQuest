import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { TreeHousePage } from "../features/treehouse/TreeHousePage";
import { ReadingQuestPage } from "../features/reading/ReadingQuestPage";
import { WorldMapPage } from "../pages/WorldMapPage";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/treehouse" replace />} />
          <Route path="/treehouse" element={<TreeHousePage />} />
          <Route path="/map" element={<WorldMapPage />} />
          <Route path="/reading" element={<ReadingQuestPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}