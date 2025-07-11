import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveTrackingMap from "@/components/logistics/LiveTrackingMap";
import MatchingDashboard from "@/components/logistics/MatchingDashboard";
import ShipmentManager from "@/components/logistics/ShipmentManager";
import AnalyticsDashboard from "@/components/logistics/AnalyticsDashboard";
import SettlementManager from "@/components/logistics/SettlementManager";
import UpcomingDeliveries from "./UpcomingDeliveries";
import QuickActions from "./QuickActions";
import EmptyRunManager from "@/components/logistics/EmptyRunManager";
import React, { useState } from "react";

interface Delivery {
  id: string;
  origin: string;
  destination: string;
  status: string;
  requestedTime: string;
  cargo: string;
  weight: number;
}

interface MainTabsProps {
  deliveries: Delivery[];
}

const MainTabs = ({ deliveries }: MainTabsProps) => {
  const [tab, setTab] = useState("dashboard");
  const [shipmentTab, setShipmentTab] = useState("list");
  const [vehicleTab, setVehicleTab] = useState("list");
  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="grid w-full grid-cols-7 mb-6 bg-white border border-slate-200 p-1 rounded-lg">
        <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">실시간 대시보드</TabsTrigger>
        <TabsTrigger value="tracking" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">위치 추적</TabsTrigger>
        <TabsTrigger value="matching" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">AI 매칭</TabsTrigger>
        <TabsTrigger value="shipments" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">배송 관리</TabsTrigger>
        <TabsTrigger value="vehicles" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">공차 관리</TabsTrigger>
        <TabsTrigger value="settlement" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">정산 관리</TabsTrigger>
        <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">분석 리포트</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UpcomingDeliveries deliveries={deliveries} />
          <QuickActions setTab={setTab} setShipmentTab={setShipmentTab} />
        </div>
      </TabsContent>

      <TabsContent value="tracking">
        <LiveTrackingMap />
      </TabsContent>

      <TabsContent value="matching">
        <MatchingDashboard />
      </TabsContent>

      <TabsContent value="shipments">
        <ShipmentManager activeTab={shipmentTab} setActiveTab={setShipmentTab} />
      </TabsContent>

      <TabsContent value="vehicles">
        <EmptyRunManager activeTab={vehicleTab} setActiveTab={setVehicleTab} />
      </TabsContent>

      <TabsContent value="settlement">
        <SettlementManager />
      </TabsContent>

      <TabsContent value="analytics">
        <AnalyticsDashboard />
      </TabsContent>
    </Tabs>
  );
};

export default MainTabs;
