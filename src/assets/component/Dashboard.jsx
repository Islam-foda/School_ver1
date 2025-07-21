import { useState, useEffect } from 'react';
import StatsCard from './StatsCard';
import QuickActions from './QuickAction';
import RecentActivity from './RecentActivity';
import { Users, Landmark, BarChart3, User } from 'lucide-react';
import { db } from '../../services/firebaseConfig';
import { collection, getCountFromServer } from "firebase/firestore";

const DashboardContent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalTeachers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const studentsRef = collection(db, "students");
        const teachersRef = collection(db, "staff");
        const classesRef = collection(db, "classes");
        const [studentsSnapshot, teachersSnapshot, classesSnapshot] = await Promise.all([
          getCountFromServer(studentsRef),
          getCountFromServer(teachersRef),
          getCountFromServer(classesRef)
        ]);
        setStats({
          totalStudents: studentsSnapshot.data().count,
          totalTeachers: teachersSnapshot.data().count,
          totalClasses: classesSnapshot.data().count
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8 ltr:text-left rtl:text-right">
        <h1 className="text-3xl font-bold mb-2">مدرستي ذكية مرقمنة</h1>
        <p className="text-blue-100">إدارة مدرستك بكفاءة من خلال منصتنا الرقمية الشاملة</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="إجمالي الطلاب"
          value="..."
          icon={Users}
          color="bg-blue-600"
        />
        <StatsCard
          title="عدد الفصول"
          value="..."
          icon={Landmark}
          color="bg-green-600"
        />
        <StatsCard
          title="المعلمين"
          value="..."
          icon={User}
          color="bg-purple-600"
        />
        <StatsCard
          title="معدل الحضور"
          value="..."
          icon={BarChart3}
          color="bg-orange-600"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ltr:text-left rtl:text-right">
        <QuickActions />
        <RecentActivity />
      </div>
    </div>;
  }

  if (error) {
    return <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8 ltr:text-left rtl:text-right">
        <h1 className="text-3xl font-bold mb-2">مدرستي ذكية مرقمنة</h1>
        <p className="text-blue-100">إدارة مدرستك بكفاءة من خلال منصتنا الرقمية الشاملة</p>
      </div>
      <div className="text-red-600 font-bold">حدث خطأ أثناء تحميل الإحصائيات: {error}</div>
    </div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8 ltr:text-left rtl:text-right">
        <h1 className="text-3xl font-bold mb-2">مدرستي ذكية مرقمنة</h1>
        <p className="text-blue-100">إدارة مدرستك بكفاءة من خلال منصتنا الرقمية الشاملة</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="إجمالي الطلاب"
          value={stats.totalStudents}
          icon={Users}
          color="bg-blue-600"
        />
        <StatsCard
          title="عدد الفصول"
          value={stats.totalClasses}
          icon={Landmark}
          color="bg-green-600"
        />
        <StatsCard
          title="المعلمين"
          value={stats.totalTeachers}
          icon={User}
          color="bg-purple-600"
        />
        <StatsCard
          title="معدل الحضور"
          value="96%"
          icon={BarChart3}
          color="bg-orange-600"
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
