import { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MainTabs from "@/components/dashboard/MainTabs";
import { UserRole } from "@/types/UserRole";
// import { realTimeStats, upcomingDeliveries } from "@/data/mockData";

const Index = () => {
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [stats, setStats] = useState(null);
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    axios.get("/api/kpi_stats").then(res => {
      setStats(res.data[res.data.length - 1]);
    });
    axios.get("/api/shipments").then(res => {
      if (Array.isArray(res.data)) {
        setDeliveries(res.data);
      } else {
        setDeliveries([]);
      }
    });
  }, []);

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-6">
      <DashboardHeader 
        userRole={userRole} 
        onRoleChange={setUserRole} 
        stats={stats} 
      />
      <MainTabs deliveries={deliveries} />
    </div>
  );
};

export default Index;
