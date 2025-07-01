import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, Outlet } from 'react-router-dom';
import { collection, query, getDocs,deleteDoc,doc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig'; // Adjust import path as needed
import StaffList from './StaffList';
import { 
  Briefcase, 
  TrendingUp, 
  GraduationCap, 
  FileText, 
  Calendar, 
  Printer 
} from 'lucide-react';

const Staff = () => {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">شئون الموظفين</h1>
      
      {/* Staff Content Area */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <Outlet /> 
      </div>
    </div>
  );
};

const StaffSection = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(staffId ? 'assignments' : null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showIconMenu, setShowIconMenu] = useState(true);

  useEffect(() => {
    if (staffId) {
      setActiveTab('assignments');
      setShowIconMenu(false);
    }
  }, [staffId]);

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'staff'));
        const querySnapshot = await getDocs(q);
        const staffData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStaff(staffData);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStaff();
  }, []);

  const menuItems = [
    {
      key: 'assignments',
      title: 'تكليفات',
      icon: Briefcase,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
    },
    {
      key: 'promotions',
      title: 'ترقيات',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600 hover:bg-green-200'
    },
    {
      key: 'trainings',
      title: 'تدريبات',
      icon: GraduationCap,
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200'
    },
    {
      key: 'reports',
      title: 'تقارير',
      icon: FileText,
      color: 'bg-orange-100 text-orange-600 hover:bg-orange-200'
    },
    {
      key: 'leaves',
      title: 'أذون واجازات',
      icon: Calendar,
      color: 'bg-red-100 text-red-600 hover:bg-red-200'
    },
    {
      key: 'print',
      title: 'طباعة (إذن خروج /طلب إجازة /إخطار عارضة /خطاب تأمين صحى)',
      icon: Printer,
      color: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
    }
  ];

  const handleMenuItemClick = (key) => {
    setActiveTab(key);
    setShowIconMenu(false);
  };

  const handleBackToMenu = () => {
    setActiveTab(null);
    setShowIconMenu(true);
  };

  const getFormName = (key) => {
    const item = menuItems.find(item => item.key === key);
    return item ? item.title : key;
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      // Delete the staff document from Firestore
      await deleteDoc(doc(db, 'staff', staffId));
      
      // Update the local state to remove the deleted staff member
      setStaff(prevStaff => 
        prevStaff.filter(member => member.id !== staffId)
      );
      
      console.log('Staff member deleted successfully');
      
    } catch (error) {
      console.error('Error deleting staff member:', error);
      throw error;
    }
  };

  const forms = {
    assignments: <AssignmentsForm />,
    promotions: <PromotionsForm />,
    trainings: <TrainingsForm />,
    reports: <ReportsForm />,
    leaves: <LeavesForm />,
    print: <PrintFormsStaff />,
    list: (
      <StaffList 
        staff={staff} 
        loading={loading} 
        onEditStaff={(id) => navigate(`/staff/${id}`)}
        onDeleteStaff={handleDeleteStaff}
      />
    )
  };

  return (
    <div>
      <div className="bg-green-600 p-4 text-white mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">إدارة شئون الموظفين</h2>
        {!showIconMenu && (
          <button
            onClick={handleBackToMenu}
            className="bg-green-500 hover:bg-green-400 px-3 py-1 rounded text-sm"
          >
            العودة للقائمة الرئيسية
          </button>
        )}
      </div>
      
      {showIconMenu ? (
        // Icon Menu View
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => handleMenuItemClick(item.key)}
                  className={`${item.color} p-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <IconComponent size={48} />
                    <span className="text-sm font-medium text-center leading-tight">
                      {item.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        // Form View
        <div className="p-4">
          <div className="flex overflow-x-auto mb-4">
            {Object.keys(forms).map(key => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 mx-1 rounded-t-lg whitespace-nowrap ${
                  activeTab === key ? 'bg-green-100 text-green-600' : 'bg-gray-100'
                }`}
              >
                {getFormName(key)}
              </button>
            ))}
          </div>
          
          <div className="border rounded-lg p-4">
            {forms[activeTab]}
          </div>
        </div>
      )}
    </div>
  );
};

// Placeholder components for each form
const AssignmentsForm = () => (
  <div className="p-6 text-center">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">تكليفات الموظفين</h3>
    <p className="text-gray-600">قيد التطوير - إدارة تكليفات الموظفين</p>
  </div>
);

const PromotionsForm = () => (
  <div className="p-6 text-center">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">ترقيات الموظفين</h3>
    <p className="text-gray-600">قيد التطوير - إدارة ترقيات الموظفين</p>
  </div>
);

const TrainingsForm = () => (
  <div className="p-6 text-center">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">تدريبات الموظفين</h3>
    <p className="text-gray-600">قيد التطوير - إدارة تدريبات الموظفين</p>
  </div>
);

const ReportsForm = () => (
  <div className="p-6 text-center">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">تقارير الموظفين</h3>
    <p className="text-gray-600">قيد التطوير - تقارير الموظفين</p>
  </div>
);

const LeavesForm = () => (
  <div className="p-6 text-center">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">أذون وإجازات</h3>
    <p className="text-gray-600">قيد التطوير - إدارة الأذون والإجازات</p>
  </div>
);

const PrintFormsStaff = () => (
  <div className="p-6 text-center">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">طباعة النماذج</h3>
    <div className="space-y-2 text-gray-600">
      <p>• إذن خروج</p>
      <p>• طلب إجازة</p>
      <p>• إخطار عارضة</p>
      <p>• خطاب تأمين صحي</p>
    </div>
    <p className="text-gray-500 mt-4">قيد التطوير</p>
  </div>
);

export default Staff;
export { StaffSection };