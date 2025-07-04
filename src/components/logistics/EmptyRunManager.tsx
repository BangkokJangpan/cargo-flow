import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusMap = {
  R: { label: "예정", color: "bg-yellow-100 text-yellow-800" },
  F: { label: "완료", color: "bg-green-100 text-green-800" },
  C: { label: "취소", color: "bg-red-100 text-red-800" },
};

const EmptyRunManager = ({ activeTab, setActiveTab }) => {
  const [emptyruns, setEmptyruns] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    vehicle_id: "",
    driver_id: "",
    origin: "",
    destination: "",
    departure_date: "",
    departure_time: "",
    arrival_time: "",
    available_weight: "",
    status: "R",
  });

  useEffect(() => {
    fetchAll();
    axios.get("/api/vehicles").then(res => setVehicles(Array.isArray(res.data) ? res.data : []));
    axios.get("/api/drivers").then(res => setDrivers(Array.isArray(res.data) ? res.data : []));
  }, []);

  const fetchAll = () => {
    axios.get("/api/emptyruns").then(res => setEmptyruns(Array.isArray(res.data) ? res.data : []));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      vehicle_id: form.vehicle_id === "" ? 0 : Number(form.vehicle_id),
      driver_id: form.driver_id === "" ? 0 : Number(form.driver_id),
    };
    if (editId) {
      await axios.put(`/api/emptyruns/${editId}`, data);
      setEditId(null);
    } else {
      await axios.post("/api/emptyruns", data);
    }
    setForm({
      vehicle_id: "",
      driver_id: "",
      origin: "",
      destination: "",
      departure_date: "",
      departure_time: "",
      arrival_time: "",
      available_weight: "",
      status: "R",
    });
    fetchAll();
    setActiveTab("list");
  };

  const handleEdit = (row) => {
    setEditId(row.emptyrun_id);
    setForm({
      ...row,
      vehicle_id: String(row.vehicle_id ?? ""),
      driver_id: String(row.driver_id ?? ""),
    });
    setActiveTab("create");
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      await axios.delete(`/api/emptyruns/${id}`);
      fetchAll();
    }
  };

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
                  🚚 공차 목록 ({emptyruns.length})
                </span>
                <div className="flex gap-2">
                  <Input placeholder="공차 ID/운전자 검색..." className="w-48" />
                  <Button variant="outline">🔍 검색</Button>
                </div>
              </CardTitle>
              <CardDescription>
                등록된 모든 공차 정보를 확인할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emptyruns.map((row, idx) => (
                  <div key={row.emptyrun_id ? `emptyrun-${String(row.emptyrun_id)}-${idx}` : `emptyrun-idx-${idx}`} className="p-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={statusMap[row.status]?.color + " text-sm"}>{statusMap[row.status]?.label || row.status}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg text-blue-600">
                          {row.available_weight != null ? `${row.available_weight}kg` : "-"}
                        </div>
                        <div className="text-sm text-slate-500">여유적재중량</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">차량번호:</span> {vehicles.find(v => v.vehicle_id === row.vehicle_id)?.number || row.vehicle_id}
                        </p>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">운전자:</span> {drivers.find(d => d.driver_id === row.driver_id)?.name || row.driver_id}
                        </p>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">출발지:</span> {row.origin}
                        </p>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">도착지:</span> {row.destination}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">출발일자:</span> {row.departure_date}
                        </p>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">출발시각:</span> {row.departure_time}
                        </p>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">도착예정시각:</span> {row.arrival_time}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(row)}>수정</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(row.emptyrun_id)}>삭제</Button>
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
              <CardTitle>{editId ? "공차 정보 수정" : "새 공차 등록"}</CardTitle>
              <CardDescription>공차 정보를 입력하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>차량번호</Label>
                    <Select name="vehicle_id" value={form.vehicle_id} onValueChange={val => setForm(f => ({ ...f, vehicle_id: val }))}>
                      <SelectTrigger><SelectValue placeholder="차량 선택" /></SelectTrigger>
                      <SelectContent>
                        {vehicles.map(v => <SelectItem key={v.vehicle_id} value={String(v.vehicle_id)}>{v.number}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>운전자</Label>
                    <Select name="driver_id" value={form.driver_id} onValueChange={val => setForm(f => ({ ...f, driver_id: val }))}>
                      <SelectTrigger><SelectValue placeholder="운전자 선택" /></SelectTrigger>
                      <SelectContent>
                        {drivers.map(d => <SelectItem key={d.driver_id} value={String(d.driver_id)}>{d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>출발지</Label>
                    <Input name="origin" value={form.origin} onChange={handleChange} />
                  </div>
                  <div>
                    <Label>도착지</Label>
                    <Input name="destination" value={form.destination} onChange={handleChange} />
                  </div>
                  <div>
                    <Label>출발일자</Label>
                    <Input name="departure_date" type="date" value={form.departure_date} onChange={handleChange} />
                  </div>
                  <div>
                    <Label>출발시각</Label>
                    <Input name="departure_time" type="time" value={form.departure_time} onChange={handleChange} />
                  </div>
                  <div>
                    <Label>도착예정시각</Label>
                    <Input name="arrival_time" type="time" value={form.arrival_time} onChange={handleChange} />
                  </div>
                  <div>
                    <Label>여유적재중량</Label>
                    <Input name="available_weight" type="number" value={form.available_weight} onChange={handleChange} />
                  </div>
                  <div>
                    <Label>상태</Label>
                    <Select name="status" value={form.status} onValueChange={val => setForm(f => ({ ...f, status: val }))}>
                      <SelectTrigger><SelectValue /> </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="R">예정</SelectItem>
                        <SelectItem value="F">완료</SelectItem>
                        <SelectItem value="C">취소</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="bg-blue-600 text-white">{editId ? "수정 완료" : "등록"}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmptyRunManager; 