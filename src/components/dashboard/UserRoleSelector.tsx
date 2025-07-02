
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types/UserRole";

interface UserRoleSelectorProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const UserRoleSelector = ({ userRole, onRoleChange }: UserRoleSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      <select 
        value={userRole} 
        onChange={(e) => onRoleChange(e.target.value as UserRole)}
        className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium"
      >
        <option value="admin">관리자</option>
        <option value="shipper">화주</option>
        <option value="carrier">운송사</option>
        <option value="driver">운전자</option>
      </select>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
        실시간 알림 <Badge className="ml-2 bg-red-500">3</Badge>
      </Button>
    </div>
  );
};

export default UserRoleSelector;
