import { isAuthenticated } from "@/lib/auth";
import { getAllLeads, getLeadStats } from "@/lib/db";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminClient";

export default async function AdminPage() {
  try {
    if (!(await isAuthenticated())) {
      return <AdminLogin />;
    }
  } catch {
    return <AdminLogin />;
  }

  try {
    const leads = await getAllLeads();
    const stats = await getLeadStats();
    return <AdminDashboard leads={leads} stats={stats} />;
  } catch {
    return <AdminLogin />;
  }
}
