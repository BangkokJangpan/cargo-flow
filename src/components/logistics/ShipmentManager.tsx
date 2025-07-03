import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const ShipmentManager = () => {
  // 기존 하드코딩 데이터 주석 처리
  // const [shipments] = useState([...]);
  const [shipments, setShipments] = useState([]);
  const [newShipment, setNewShipment] = useState({
    origin: "",
    destination: "",
    cargoType: "",
    weight: "",
    volume: "",
    requestedTime: "",
    specialInstructions: "",
    isUrgent: false,
    shipper: "",
    status: "",
    estimatedCost: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("list");
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    axios.get("/api/shipments").then(res => {
      // shipment_id 등 모든 필드가 보존되도록 그대로 저장
      setShipments(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "매칭중": return "bg-yellow-100 text-yellow-800";
      case "운송중": return "bg-blue-100 text-blue-800";
      case "완료": return "bg-green-100 text-green-800";
      case "취소": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleSubmitShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      // 수정
      try {
        await axios.put(`/api/shipments/${editId}`, {
          ...newShipment,
        });
        setShipments((prev: any) => prev.map((s: any) => s.shipment_id === editId ? { ...s, ...newShipment, shipment_id: editId } : s));
        setEditId(null);
        setNewShipment({
          origin: "",
          destination: "",
          cargoType: "",
          weight: "",
          volume: "",
          requestedTime: "",
          specialInstructions: "",
          isUrgent: false,
          shipper: "",
          status: "",
          estimatedCost: "",
        });
        setActiveTab("list");
      } catch (err) {
        alert("수정 중 오류가 발생했습니다.");
      }
    } else {
      // 신규 등록
      axios.post("/api/shipments", { ...newShipment }).then(() => {
        axios.get("/api/shipments").then(res => setShipments(Array.isArray(res.data) ? res.data : []));
        setActiveTab("list");
      });
    }
  };

  const handleDeleteShipment = async (shipment_id: number) => {
    if (window.confirm("정말로 이 배송 요청을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/shipments/${shipment_id}`);
        const res = await axios.get("/api/shipments");
        setShipments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleEditShipment = (shipment: any) => {
    setEditId(shipment.shipment_id);
    setNewShipment({
      origin: shipment.origin || "",
      destination: shipment.destination || "",
      cargoType: shipment.cargoType || "",
      weight: shipment.weight || "",
      volume: shipment.volume || "",
      requestedTime: shipment.requestedTime ? shipment.requestedTime.slice(0, 16) : "",
      specialInstructions: shipment.specialInstructions || "",
      isUrgent: shipment.isUrgent || false,
      shipper: shipment.shipper || "",
      status: shipment.status || "",
      estimatedCost: shipment.estimatedCost || "",
    });
    setActiveTab("create");
  };

  useEffect(() => {
    if (editId === null) {
      setShipment(null);
      setError(null);
      return;
    }
    axios.get(`/api/shipments/${editId}`)
      .then(res => {
        setShipment(res.data);
        setError(null);
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          setError("존재하지 않는 배송 요청입니다.");
        } else {
          setError("서버 오류가 발생했습니다.");
        }
        setShipment(null);
      });
  }, [editId]);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">배송 목록</TabsTrigger>
          <TabsTrigger value="create">새 배송 등록</TabsTrigger>
          <TabsTrigger value="analytics">배송 통계</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  📦 배송 요청 목록 ({shipments.length})
                </span>
                <div className="flex gap-2">
                  <Input placeholder="배송 ID 검색..." className="w-48" />
                  <Button variant="outline">🔍 검색</Button>
                </div>
              </CardTitle>
              <CardDescription>
                등록된 모든 배송 요청의 현황을 확인할 수 있습니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipments.map((shipment, idx) => (
                  <div key={shipment.shipment_id ? `shipment-${String(shipment.shipment_id)}-${idx}` : `shipment-idx-${idx}`} className="p-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-sm ${getStatusColor(shipment.status)}`}>{shipment.status}</Badge>
                        {shipment.isUrgent && (
                          <Badge className="bg-red-100 text-red-800 text-sm">🚨 긴급</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg text-green-600">
                          ₩{shipment.estimatedCost != null ? shipment.estimatedCost.toLocaleString() : "-"}
                        </div>
                        <div className="text-sm text-slate-500">예상운임</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">화주:</span> {shipment.shipper}
                        </p>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">출발:</span> {shipment.origin}
                        </p>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">도착:</span> {shipment.destination}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">화물:</span> {shipment.cargoType}
                        </p>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">중량/부피:</span> {shipment.weight}kg / {shipment.volume}m³
                        </p>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">요청시간:</span> {shipment.requestedTime ? new Date(shipment.requestedTime).toLocaleString() : "정보 없음"}
                        </p>
                      </div>
                    </div>

                    {shipment.specialInstructions && (
                      <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm text-yellow-800">
                          <span className="font-medium">특별지시사항:</span> {shipment.specialInstructions}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">📋 상세보기</Button>
                      <Button size="sm" variant="outline">📍 위치추적</Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditShipment(shipment)}>✏️ 수정</Button>
                      <Button size="sm" variant="destructive" onClick={() => shipment.shipment_id ? handleDeleteShipment(shipment.shipment_id) : null} disabled={!shipment.shipment_id}>🗑️ 삭제</Button>
                      {shipment.status === "매칭중" && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          🤖 매칭 가속
                        </Button>
                      )}
                      {shipment.status === "완료" && (
                        <Button size="sm" variant="outline">📄 운송장</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{editId ? "✏️ 새 배송 요청 수정" : "🆕 새 배송 요청 등록"}</CardTitle>
              <CardDescription>
                새로운 배송 요청을 등록하고 자동 매칭을 시작합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitShipment} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="shipper">화주(회사)</Label>
                  <Input
                    id="shipper"
                    name="shipper"
                    placeholder="화주(회사)명 입력"
                    value={newShipment.shipper}
                    onChange={e => setNewShipment({ ...newShipment, shipper: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">상태</Label>
                  <Select value={newShipment.status || ""} onValueChange={(value) => setNewShipment({...newShipment, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="매칭중">매칭중</SelectItem>
                      <SelectItem value="운송중">운송중</SelectItem>
                      <SelectItem value="완료">완료</SelectItem>
                      <SelectItem value="취소">취소</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">예상 운임 (원)</Label>
                  <Input
                    id="estimatedCost"
                    name="estimatedCost"
                    type="number"
                    placeholder="10000"
                    value={newShipment.estimatedCost || ""}
                    onChange={(e) => setNewShipment({...newShipment, estimatedCost: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">출발지 주소</Label>
                    <Input
                      id="origin"
                      name="origin"
                      placeholder="서울시 강남구 테헤란로 123"
                      value={newShipment.origin}
                      onChange={(e) => setNewShipment({...newShipment, origin: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">도착지 주소</Label>
                    <Input
                      id="destination"
                      name="destination"
                      placeholder="부산시 해운대구 센텀로 456"
                      value={newShipment.destination}
                      onChange={(e) => setNewShipment({...newShipment, destination: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cargoType">화물 종류</Label>
                    <Select onValueChange={(value) => setNewShipment({...newShipment, cargoType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="화물 종류 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">일반화물</SelectItem>
                        <SelectItem value="electronics">전자제품</SelectItem>
                        <SelectItem value="food">식품</SelectItem>
                        <SelectItem value="chemicals">화학제품</SelectItem>
                        <SelectItem value="construction">건설자재</SelectItem>
                        <SelectItem value="automotive">자동차부품</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">중량 (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="500"
                      value={newShipment.weight}
                      onChange={(e) => setNewShipment({...newShipment, weight: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volume">부피 (m³)</Label>
                    <Input
                      id="volume"
                      type="number"
                      step="0.1"
                      placeholder="2.5"
                      value={newShipment.volume}
                      onChange={(e) => setNewShipment({...newShipment, volume: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestedTime">희망 수거 시간</Label>
                  <Input
                    id="requestedTime"
                    type="datetime-local"
                    value={newShipment.requestedTime}
                    onChange={(e) => setNewShipment({...newShipment, requestedTime: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialInstructions">특별 지시사항</Label>
                  <Textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    placeholder="깨지기 쉬운 물품, 냉장 보관 필요 등..."
                    value={newShipment.specialInstructions}
                    onChange={(e) => setNewShipment({...newShipment, specialInstructions: e.target.value})}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    checked={newShipment.isUrgent}
                    onChange={(e) => setNewShipment({...newShipment, isUrgent: e.target.checked})}
                  />
                  <Label htmlFor="isUrgent">🚨 긴급 배송 (추가 수수료 발생)</Label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    {editId ? "✏️ 배송 요청 수정" : "📦 배송 요청 등록"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => { setEditId(null); setActiveTab("list"); }}>
                    취소
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">📊 이번 달 배송</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">247건</div>
                <div className="text-sm text-slate-500">전월 대비 +15%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-center">💰 총 운임</CardTitle>
              </CardHeader>  
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">₩54.2M</div>
                <div className="text-sm text-slate-500">전월 대비 +22%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-center">⭐ 평균 만족도</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">4.8/5</div>
                <div className="text-sm text-slate-500">총 189개 리뷰</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      {error && (
        <div className="text-red-500 text-center py-8">{error}</div>
      )}
    </div>
  );
};

export default ShipmentManager;
