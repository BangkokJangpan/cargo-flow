
import KPICards from "./KPICards";
import UserRoleSelector from "./UserRoleSelector";
import { UserRole } from "@/types/UserRole";

interface DashboardHeaderProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  stats: {
    activeVehicles: number;
    completedDeliveries: number;
    emptyMileageRate: number;
    matchingSuccessRate: number;
    todayRevenue: number;
  };
}

const DashboardHeader = ({ userRole, onRoleChange, stats }: DashboardHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">🚚 LogiShare</h1>
          <p className="text-lg text-slate-600">AI 기반 공유 물류 플랫폼</p>
        </div>
        <UserRoleSelector userRole={userRole} onRoleChange={onRoleChange} />
      </div>

      {/* 실시간 KPI 카드 */}
      <KPICards stats={stats} />
    </div>
  );
};

export default DashboardHeader;
