import StatsCard from './StatsCard';
import QuickActions from './QuickAction';
import RecentActivity from './RecentActivity';
import { Users, Landmark, BarChart3, User } from 'lucide-react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const DashboardContent = () => {
  // Simulate loading state
  
  return (
     <div className="p-6 space-y-6 ">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8 ltr:text-left rtl:text-right">
        <h1 className="text-3xl font-bold mb-2">مدرستي ذكية مرقمنة</h1>
        <p className="text-blue-100">إدارة مدرستك بكفاءة من خلال منصتنا الرقمية الشاملة</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="إجمالي الطلاب"
          value="1,247"
          icon={Users}
          color="bg-blue-600"
          timer="12"
        />
        <StatsCard
          title="عدد الفصول"
          value="24"
          icon={Landmark}
          color="bg-green-600"
          timer="8"
        />
        <StatsCard
          title="المعلمين"
          value="56"
          icon={User}
          color="bg-purple-600"
          timer="3"
        />
        <StatsCard
          title="معدل الحضور"
          value="94%"
          icon={BarChart3}
          color="bg-orange-600"
          timer="2"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ltr:text-left rtl:text-right">
        <QuickActions />
        <RecentActivity />
      </div>
    </div>
  
  );
};
export default DashboardContent;
