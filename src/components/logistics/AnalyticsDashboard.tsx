import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const AnalyticsDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [kpiStats, setKpiStats] = useState([]);
  const [matchingQueue, setMatchingQueue] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [carrierSettlements, setCarrierSettlements] = useState([]);

  useEffect(() => {
    axios.get("/api/shipments").then(res => setShipments(Array.isArray(res.data) ? res.data : []));
    axios.get("/api/carriers").then(res => {
      console.log("carrierSettlements API 응답:", res.data);
      setCarrierSettlements(Array.isArray(res.data) ? res.data : []);
    });
    axios.get("/api/shipment_settlements").then(res => setSettlements(Array.isArray(res.data) ? res.data : []));
    axios.get("/api/kpi_stats").then(res => setKpiStats(Array.isArray(res.data) ? res.data : []));
    axios.get("/api/matching_queue").then(res => setMatchingQueue(Array.isArray(res.data) ? res.data : []));
    axios.get("/api/vehicles").then(res => setAvailableVehicles(Array.isArray(res.data) ? res.data : []));
  }, []);

  // 매출 트렌드 데이터
  const revenueData = [
    { month: "8월", revenue: 85, cost: 68, profit: 17 },
    { month: "9월", revenue: 92, cost: 72, profit: 20 },
    { month: "10월", revenue: 78, cost: 61, profit: 17 },
    { month: "11월", revenue: 108, cost: 84, profit: 24 },
    { month: "12월", revenue: 128, cost: 98, profit: 30 }
  ];

  // 공차율 데이터
  const efficiencyData = [
    { day: "월", loaded: 85, empty: 15 },
    { day: "화", loaded: 78, empty: 22 },
    { day: "수", loaded: 92, empty: 8 }, 
    { day: "목", loaded: 88, empty: 12 },
    { day: "금", loaded: 82, empty: 18 },
    { day: "토", loaded: 75, empty: 25 },
    { day: "일", loaded: 70, empty: 30 }
  ];

  // 지역별 배송 분포
  const regionData = [
    { name: "서울", value: 35, color: "#3B82F6" },
    { name: "경기", value: 28, color: "#10B981" },
    { name: "부산", value: 15, color: "#F59E0B" },
    { name: "대구", value: 12, color: "#EF4444" },
    { name: "기타", value: 10, color: "#8B5CF6" }
  ];

  // 배송 상태별 분포
  const statusData = [
    { name: "완료", value: 68, color: "#10B981" },
    { name: "운송중", value: 22, color: "#3B82F6" },
    { name: "매칭중", value: 8, color: "#F59E0B" },
    { name: "취소", value: 2, color: "#EF4444" }
  ];

  return (
    <div className="space-y-6">
      {/* KPI 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-blue-100 text-sm">이달 매출</p>
              <p className="text-2xl font-bold">₩1.28억</p>
              <p className="text-xs text-blue-200">+18.5% ↗</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-green-100 text-sm">평균 공차율</p>
              <p className="text-2xl font-bold">16.4%</p>
              <p className="text-xs text-green-200">-2.1% ↓</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-purple-100 text-sm">매칭 성공률</p>
              <p className="text-2xl font-bold">94.2%</p>
              <p className="text-xs text-purple-200">+1.8% ↗</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-orange-100 text-sm">활성 차량</p>
              <p className="text-2xl font-bold">127대</p>
              <p className="text-xs text-orange-200">+8대 ↗</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 매출 트렌드 차트 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📈 월별 매출 트렌드
            </CardTitle>
            <CardDescription>최근 5개월간 매출, 비용, 순이익 추이</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₩${value}백만`, ""]} />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} name="매출" />
                <Line type="monotone" dataKey="cost" stroke="#EF4444" strokeWidth={2} name="비용" />
                <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} name="순이익" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 효율성 분석 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚡ 주간 운송 효율성
            </CardTitle>
            <CardDescription>요일별 적재율 vs 공차율 비교</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, ""]} />
                <Bar dataKey="loaded" fill="#10B981" name="적재율" />
                <Bar dataKey="empty" fill="#F59E0B" name="공차율" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 지역별 배송 분포 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🗺️ 지역별 배송 분포
            </CardTitle>
            <CardDescription>주요 배송 지역 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "비율"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 배송 상태 분포 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📦 배송 상태 현황
            </CardTitle>
            <CardDescription>전체 배송 건수 대비 상태별 분포</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "비율"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 성과 지표 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>🏆 주요 성과 지표</CardTitle>
          <CardDescription>이번 달 핵심 KPI 및 목표 달성도</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">247건</div>
              <div className="text-sm text-blue-500 mb-1">완료된 배송</div>
              <div className="text-xs text-slate-500">목표: 250건 (98.8% 달성)</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">4.8점</div>
              <div className="text-sm text-green-500 mb-1">평균 만족도</div>
              <div className="text-xs text-slate-500">목표: 4.5점 (초과 달성)</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">23.5%</div>
              <div className="text-sm text-purple-500 mb-1">평균 공차율</div>
              <div className="text-xs text-slate-500">목표: 25% (목표 달성)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
