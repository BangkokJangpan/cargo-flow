import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SettlementManager = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-12");

  // 기존 하드코딩 데이터 주석 처리
  // const settlementData = { ... };
  // const carrierSettlements = [ ... ];
  // const shipmentSettlements = [ ... ];
  const [settlementData, setSettlementData] = useState({
    totalRevenue: 0,
    platformFee: 0,
    carrierPayouts: 0,
    pendingSettlements: 0,
    completedSettlements: 0
  });
  const [carrierSettlements, setCarrierSettlements] = useState([]);
  const [shipmentSettlements, setShipmentSettlements] = useState([]);

  useEffect(() => {
    axios.get("/api/kpi_stats").then(res => {
      const last = res.data[res.data.length - 1];
      setSettlementData({
        totalRevenue: last?.todayRevenue || 0,
        platformFee: 0, // 필요시 별도 계산
        carrierPayouts: 0, // 필요시 별도 계산
        pendingSettlements: 0, // 필요시 별도 계산
        completedSettlements: 0 // 필요시 별도 계산
      });
    });
    axios.get("/api/carriers").then(res => {
      console.log("[DEBUG] carrierSettlements API 응답:", res.data);
      setCarrierSettlements(Array.isArray(res.data) ? res.data : []);
    });
    axios.get("/api/shipment_settlements").then(res => setShipmentSettlements(Array.isArray(res.data) ? res.data : []));
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "완료": case "정산완료": return "bg-green-100 text-green-800";
      case "대기": case "정산대기": return "bg-yellow-100 text-yellow-800";
      case "처리중": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* 정산 현황 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-blue-100 text-sm">총 매출</p>
              <p className="text-2xl font-bold">₩{(settlementData.totalRevenue / 10000).toFixed(0)}만</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-purple-100 text-sm">플랫폼 수수료</p>
              <p className="text-2xl font-bold">₩{(settlementData.platformFee / 10000).toFixed(0)}만</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-green-100 text-sm">운송사 지급액</p>
              <p className="text-2xl font-bold">₩{(settlementData.carrierPayouts / 10000).toFixed(0)}만</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-orange-100 text-sm">정산 대기</p>
              <p className="text-2xl font-bold">{settlementData.pendingSettlements}건</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-emerald-100 text-sm">정산 완료</p>
              <p className="text-2xl font-bold">{settlementData.completedSettlements}건</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="carriers" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-fit grid-cols-3">
            <TabsTrigger value="carriers">운송사별 정산</TabsTrigger>
            <TabsTrigger value="shipments">배송별 정산</TabsTrigger>
            <TabsTrigger value="reports">정산 리포트</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-12">2024년 12월</SelectItem>
                <SelectItem value="2024-11">2024년 11월</SelectItem>
                <SelectItem value="2024-10">2024년 10월</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              📊 Excel 다운로드
            </Button>
          </div>
        </div>

        <TabsContent value="carriers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>🚛 운송사별 정산 현황</span>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  💰 일괄 정산 처리
                </Button>
              </CardTitle>
              <CardDescription>
                운송사별 월간 정산 내역 및 지급 현황
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {carrierSettlements.map((settlement) => (
                  <div key={settlement.carrier_id} className="p-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="font-semibold text-lg text-slate-800">
                          {settlement.carrierName}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {settlement.carrier_id}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(settlement.status)}`}>
                          {settlement.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          ₩{settlement.netAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500">
                          (총 ₩{settlement.totalRevenue.toLocaleString()})
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="text-lg font-semibold text-blue-600">{settlement.totalDeliveries}</div>
                        <div className="text-xs text-blue-500">완료 배송</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="text-lg font-semibold text-purple-600">₩{(settlement.platformFee / 10000).toFixed(0)}만</div>
                        <div className="text-xs text-purple-500">플랫폼 수수료</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="text-lg font-semibold text-green-600">₩{(settlement.netAmount / 10000).toFixed(0)}만</div>
                        <div className="text-xs text-green-500">지급 예정액</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-lg font-semibold text-gray-600">
                          {settlement.settlementDate ? new Date(settlement.settlementDate).toLocaleDateString() : "미정"}
                        </div>
                        <div className="text-xs text-gray-500">정산일</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">📋 상세 내역</Button>
                      <Button size="sm" variant="outline">🏦 계좌 정보</Button>
                      {settlement.status === "대기" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          💸 정산 처리
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>📦 배송별 정산 내역</CardTitle>
              <CardDescription>
                개별 배송 건별 운임 계산 및 정산 현황
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipmentSettlements.map((settlement) => (
                  <div key={settlement.shipment_id} className="p-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{settlement.shipment_id}</Badge>
                        <Badge className={`text-xs ${getStatusColor(settlement.status)}`}>
                          {settlement.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ₩{settlement.carrierAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500">운송사 수취액</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">운송사:</span> {settlement.carrierName}
                        </p>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">운전자:</span> {settlement.driverName}
                        </p>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">경로:</span> {settlement.route}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">완료시간:</span> {new Date(settlement.completedDate).toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">총 운임:</span> ₩{settlement.totalFare.toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">수수료:</span> ₩{settlement.platformFee.toLocaleString()} (20%)
                        </p>
                      </div>
                    </div>

                    {/* 운임 계산 상세 */}
                    <div className="p-3 bg-slate-50 rounded-lg mb-3">
                      <h4 className="font-medium text-sm text-slate-700 mb-2">💰 운임 계산 내역</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">거리 기반:</span>
                          <span className="float-right font-medium">₩{settlement.baseFare.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">시간 기반:</span>
                          <span className="float-right font-medium">₩{settlement.timeFare.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">중량 기반:</span>
                          <span className="float-right font-medium">₩{settlement.weightFare.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">📄 영수증</Button>
                      <Button size="sm" variant="outline">📊 상세 분석</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>📈 월별 정산 트렌드</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-slate-600">Recharts 차트 영역</p>
                    <p className="text-sm text-slate-500">월별 매출/수수료 트렌드</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🏆 운송사별 성과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <div>
                      <div className="font-semibold">🥇 한국운송</div>
                      <div className="text-sm text-slate-600">45건 • ₩1,820만</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-600">1위</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                    <div>
                      <div className="font-semibold">🥈 안전운송</div>
                      <div className="text-sm text-slate-600">52건 • ₩2,130만</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-600">2위</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                    <div>
                      <div className="font-semibold">🥉 신속물류</div>
                      <div className="text-sm text-slate-600">38건 • ₩1,560만</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">3위</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettlementManager;
