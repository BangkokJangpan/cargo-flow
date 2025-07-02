
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-700">빠른 작업</CardTitle>
        <CardDescription>자주 사용하는 기능에 빠르게 접근</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          + 새 배송 요청 등록
        </Button>
        <Button variant="outline" className="w-full hover:bg-blue-50">
          🤖 AI 자동 매칭 실행
        </Button>
        <Button variant="outline" className="w-full hover:bg-green-50">
          📊 실시간 정산 현황
        </Button>
        <Button variant="outline" className="w-full hover:bg-purple-50">
          📱 운전자 앱 상태 확인
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
