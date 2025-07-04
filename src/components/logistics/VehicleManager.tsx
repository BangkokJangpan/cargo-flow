import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const VehicleManager = ({ activeTab, setActiveTab }) => {
  // 더미 데이터
  const [vehicles, setVehicles] = useState([
    {
      vehicle_id: 1,
      driver: "홍길동",
      status: "대기중",
      location: "서울",
      type: "5톤 트럭",
      note: "특이사항 없음",
    },
    {
      vehicle_id: 2,
      driver: "김철수",
      status: "운행중",
      location: "부산",
      type: "1톤 트럭",
      note: "야간 운행 가능",
    },
  ]);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">공차 목록</TabsTrigger>
          <TabsTrigger value="create">새 공차 등록</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  🚚 공차 목록 ({vehicles.length})
                </span>
                <div className="flex gap-2">
                  <Input placeholder="공차 ID/운전자 검색..." className="w-48" />
                  <Button variant="outline">🔍 검색</Button>
                </div>
              </CardTitle>
              <CardDescription>
                등록된 모든 공차의 현황을 확인할 수 있습니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vehicles.map((vehicle, idx) => (
                  <div key={vehicle.vehicle_id ? `vehicle-${String(vehicle.vehicle_id)}-${idx}` : `vehicle-idx-${idx}`} className="p-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className="text-sm bg-blue-100 text-blue-800">{vehicle.status}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">운전자:</span> {vehicle.driver}
                        </p>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">위치:</span> {vehicle.location}
                        </p>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">차종:</span> {vehicle.type}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">비고:</span> {vehicle.note}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>새 공차 등록</CardTitle>
              <CardDescription>공차 정보를 입력하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="driver">운전자</Label>
                    <Input id="driver" placeholder="운전자명" />
                  </div>
                  <div>
                    <Label htmlFor="location">위치</Label>
                    <Input id="location" placeholder="현재 위치" />
                  </div>
                  <div>
                    <Label htmlFor="type">차종</Label>
                    <Input id="type" placeholder="차종" />
                  </div>
                  <div>
                    <Label htmlFor="note">비고</Label>
                    <Textarea id="note" placeholder="특이사항 등" />
                  </div>
                </div>
                <Button type="submit" className="bg-blue-600 text-white">등록</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleManager; 