import { Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import Home from "@/pages/home/home";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}
