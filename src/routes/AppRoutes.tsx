import { Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import Home from "@/pages/home/home";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Dashboard from "@/pages/dashboard/dashboard";
import Fornecedores from "@/components/dashboard/Fornecedores";


export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Rotas do dashboard */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/Fornecedores" element={<Fornecedores />} />
      </Route>
    </Routes>
  );
}
