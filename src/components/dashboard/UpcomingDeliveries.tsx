import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface Delivery {
  id: string;
  origin: string;
  destination: string;
  status: string;
  requestedTime: string;
  cargo: string;
  weight: number;
}

interface UpcomingDeliveriesProps {
  deliveries: Delivery[];
}

const UpcomingDeliveries = ({ deliveries }: UpcomingDeliveriesProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          대기 중인 배송 요청
        </CardTitle>
        <CardDescription>매칭 대기 중이거나 진행 중인 배송 현황</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deliveries.map((delivery, idx) => (
            <div key={delivery.id ? `delivery-${delivery.id}` : `delivery-idx-${idx}`} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">{delivery.id}</Badge>
                  <Badge 
                    className={`text-xs ${
                      delivery.status === "매칭중" ? "bg-yellow-100 text-yellow-800" : 
                      delivery.status === "운송중" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {delivery.status}
                  </Badge>
                </div>
                <p className="font-medium text-slate-800 mb-1">
                  {delivery.origin} → {delivery.destination}
                </p>
                <p className="text-sm text-slate-600">
                  {delivery.cargo} • {delivery.weight}kg • {new Date(delivery.requestedTime).toLocaleString()}
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                className="ml-4 hover:bg-blue-50 hover:border-blue-300"
              >
                상세보기
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingDeliveries;
