import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import axios from "axios";

const MatchingDashboard = () => {
  const [isMatching, setIsMatching] = useState(false);
  // 기존 하드코딩 데이터 주석 처리
  // const matchingQueue = [ ... ];
  // const availableVehicles = [ ... ];
  const [matchingQueue, setMatchingQueue] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);

  useEffect(() => {
    axios.get("/api/matching_queue").then(res => {
      setMatchingQueue(Array.isArray(res.data) ? res.data : []);
    });
    axios.get("/api/vehicles").then(res => {
      setAvailableVehicles(Array.isArray(res.data) ? res.data : []);
    }).catch(error => {
      console.error("Failed to load vehicles: ", error);
    });
  }, []);

  const handleAutoMatching = () => {
    setIsMatching(true);
    setTimeout(() => {
      setIsMatching(false);
      // 실제로는 매칭 결과 업데이트
    }, 3000);
  };

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "normal": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "매칭완료": return "bg-green-100 text-green-800";
      case "매칭중": return "bg-yellow-100 text-yellow-800";
      case "대기중": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* AI 매칭 컨트롤 */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🤖 AI 자동 매칭 시스템
          </CardTitle>
          <CardDescription>
            실시간으로 최적의 차량-화물 매칭을 수행합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">매칭 대기 큐 ({matchingQueue.length}건)</h3>
              <Button 
                onClick={handleAutoMatching}
                disabled={isMatching}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                {isMatching ? "🔄 매칭 중..." : "🚀 자동 매칭 실행"}
              </Button>
            </div>

            {isMatching && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="animate-spin">🔄</div>
                  <span className="font-medium text-blue-800">AI 매칭 알고리즘 실행 중...</span>
                </div>
                <Progress value={65} className="mb-2" />
                <p className="text-sm text-blue-600">거리, 용량, 경로, 시간 적합성을 분석하고 있습니다.</p>
              </div>
            )}

            <div className="space-y-4">
              {matchingQueue.map((item, idx) => (
                <div key={item.id ? `queue-${String(item.id)}-${idx}` : `queue-idx-${idx}`} className="p-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{item.id}</Badge>
                      <Badge className={`text-xs ${getUrgencyColor(item.urgency)}`}>
                        {item.urgency === "urgent" ? "긴급" : item.urgency === "high" ? "높음" : "보통"}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                        {item.status}
                      </Badge>
                    </div>
                    {item.matchingScore && (
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600">
                          매칭점수: {item.matchingScore}%
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600 mb-1">
                        <span className="font-medium">출발:</span> {item.origin || "정보 없음"}
                      </p>
                      <p className="text-slate-600">
                        <span className="font-medium">도착:</span> {item.destination || "정보 없음"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-1">
                        <span className="font-medium">화물:</span> {item.cargo || "-"} • {item.weight !== undefined ? `${item.weight}kg` : "-"}
                      </p>
                      <p className="text-slate-600">
                        <span className="font-medium">요청시간:</span> {item.requestTime ? new Date(item.requestTime).toLocaleString() : "정보 없음"}
                      </p>
                    </div>
                  </div>

                  {item.status === "매칭완료" && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-600 font-medium">✅ 매칭된 차량: {item.matchedVehicleId || "-"} {item.matchedDriverName ? `(${item.matchedDriverName})` : ""}</span>
                        <Button size="sm" variant="outline">매칭 상세보기</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 가용 차량 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🚛 가용 차량 ({availableVehicles.length})
          </CardTitle>
          <CardDescription>
            현재 매칭 가능한 차량 목록
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableVehicles.map((vehicle, idx) => (
              <div key={vehicle.vehicle_id ? `vehicle-${String(vehicle.vehicle_id)}-${idx}` : `vehicle-idx-${idx}`} className="p-3 border border-slate-200 rounded-lg bg-white hover:bg-blue-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-slate-800">{vehicle.vehicle_id}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">{vehicle.rating}</span>
                  </div>
                </div>
                
                <div className="text-sm text-slate-600 mb-2">
                  👤 {`드라이버ID: ${vehicle.driver_id}`} • {vehicle.vehicleType}
                </div>
                
                <div className="text-sm text-slate-600 mb-2">
                  📍 {vehicle.currentLocation || "주소 정보 없음"}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <div>용량: {vehicle.capacity ? `${vehicle.capacity}kg` : "정보 없음"}</div>
                  <div>거리: {vehicle.distance !== undefined ? `${vehicle.distance}km` : "정보 없음"}</div>
                  <div>도착: {vehicle.estimatedArrival !== undefined ? `${vehicle.estimatedArrival}분` : "정보 없음"}</div>
                  <div>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                      활용가능
                    </Badge>
                  </div>
                </div>

                <Separator className="my-2" />
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    수동 배정
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs">
                    상세정보
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="text-center">
            <Button variant="outline" className="w-full">
              + 더 많은 차량 보기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchingDashboard;
