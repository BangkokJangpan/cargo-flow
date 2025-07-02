import { Card, CardContent } from "@/components/ui/card";
import { Truck, MapPin, Clock, Calendar } from "lucide-react";

interface KPICardsProps {
  stats: {
    activeVehicles: number;
    completedDeliveries: number;
    emptyMileageRate: number;
    matchingSuccessRate: number;
    todayRevenue: number;
  };
}

const KPICards = ({ stats }: KPICardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">운행 중 차량</p>
              <p className="text-2xl font-bold">{stats.activeVehicles ?? 0}대</p>
            </div>
            <Truck className="h-8 w-8 text-blue-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">완료된 배송</p>
              <p className="text-2xl font-bold">{(stats.completedDeliveries ?? 0).toLocaleString()}건</p>
            </div>
            <MapPin className="h-8 w-8 text-green-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">공차율</p>
              <p className="text-2xl font-bold">{stats.emptyMileageRate ?? 0}%</p>
            </div>
            <Clock className="h-8 w-8 text-orange-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">매칭 성공률</p>
              <p className="text-2xl font-bold">{stats.matchingSuccessRate ?? 0}%</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">오늘 매출</p>
              <p className="text-2xl font-bold">₩{((stats.todayRevenue ?? 0) / 10000).toFixed(0)}만</p>
            </div>
            <Calendar className="h-8 w-8 text-emerald-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPICards;
