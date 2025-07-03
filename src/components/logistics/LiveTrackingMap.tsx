import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Clock, Bell } from "lucide-react";
import axios from "axios";

const LiveTrackingMap = () => {
  // 기존 하드코딩 데이터 주석 처리
  // const [activeVehicles, setActiveVehicles] = useState([...]);
  const [activeVehicles, setActiveVehicles] = useState([]);

  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  useEffect(() => {
    axios.get("/api/vehicles").then(res => {
      if (Array.isArray(res.data)) {
        setActiveVehicles(res.data);
      } else {
        setActiveVehicles([]);
      }
    });

    // 실제로는 WebSocket으로 실시간 위치 업데이트
    const interval = setInterval(() => {
      setActiveVehicles(prev => Array.isArray(prev) ? prev.map(vehicle => ({
        ...vehicle,
        speed: vehicle.status === "운송중" ? Math.floor(Math.random() * 30) + 50 : 
               vehicle.status === "공차운행" ? Math.floor(Math.random() * 20) + 30 : 0
      })) : []);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "운송중": return "bg-blue-100 text-blue-800";
      case "공차운행": return "bg-yellow-100 text-yellow-800";
      case "하역중": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "운송중": return "🚛";
      case "공차운행": return "📦";
      case "하역중": return "🏗️";
      default: return "⏸️";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 지도 영역 */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            실시간 차량 위치 추적
          </CardTitle>
          <CardDescription>현재 운행 중인 차량들의 실시간 위치와 상태</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 실제로는 Google Maps나 Leaflet.js 지도가 들어갈 자리 */}
          <div className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-blue-300">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-lg font-semibold text-slate-700 mb-2">실시간 지도 영역</p>
              <p className="text-sm text-slate-500 mb-4">Google Maps API 또는 Leaflet.js 통합</p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {activeVehicles.map((vehicle, idx) => (
                  <div 
                    key={vehicle.vehicle_id || idx}
                    className={`p-2 bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-all ${
                      selectedVehicle === vehicle.vehicle_id ? 'border-blue-500 scale-105' : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedVehicle(selectedVehicle === vehicle.vehicle_id ? null : vehicle.vehicle_id)}
                  >
                    <div className="text-2xl text-center mb-1">{getStatusIcon(vehicle.status)}</div>
                    <div className="text-xs text-center font-medium">{vehicle.vehicle_id}</div>
                    <div className="text-xs text-center text-gray-500">{vehicle.speed}km/h</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 지도 컨트롤 */}
          <div className="flex items-center gap-2 mt-4">
            <Button size="sm" variant="outline">
              🎯 전체 차량 보기
            </Button>
            <Button size="sm" variant="outline">
              📍 운송중만 보기
            </Button>
            <Button size="sm" variant="outline">
              🔄 위치 새로고침
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 차량 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-500" />
              활성 차량 ({activeVehicles.length})
            </span>
            <Button size="sm" variant="ghost">
              <Bell className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription>실시간 차량 상태 및 상세 정보</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activeVehicles.map((vehicle, idx) => (
              <div 
                key={vehicle.vehicle_id || idx}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedVehicle === vehicle.vehicle_id 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
                onClick={() => setSelectedVehicle(selectedVehicle === vehicle.vehicle_id ? null : vehicle.vehicle_id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-slate-800">{vehicle.vehicle_id}</div>
                  <Badge className={`text-xs ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </Badge>
                </div>
                
                <div className="text-sm text-slate-600 mb-1">
                  👤 {`드라이버ID: ${vehicle.driver_id}`}
                </div>
                
                <div className="text-sm text-slate-600 mb-2">
                  📍 {vehicle.currentLocation || "주소 정보 없음"}
                </div>
                
                <div className="text-sm text-slate-600 mb-2">
                  🎯 {vehicle.destination || "목적지 정보 없음"}
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>💨 {vehicle.speed !== undefined ? vehicle.speed : "0"}km/h</span>
                  <span>
                    {vehicle.created_at ? (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(vehicle.created_at).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">날짜 정보 없음</span>
                    )}
                  </span>
                </div>
                
                <div className="text-xs text-slate-500 mt-1">
                  📦 {vehicle.vehicleType} / {vehicle.capacity}kg
                </div>

                {selectedVehicle === vehicle.vehicle_id && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        📞 연락하기
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        📋 상세보기
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveTrackingMap;
