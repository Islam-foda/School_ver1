import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, Outlet } from 'react-router-dom';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig'; // Adjust import path as needed
import StaffList from './StaffList';
import StaffBasicDataForm from './staffForms/StaffBasicDataForm';
 import { User, ClipboardList, TrendingUp, GraduationCap, FileText, Calendar, Printer, Users, Edit, Trash2, IdCard, Phone, Mail } from 'lucide-react';



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

// StaffSection.js - Updated with proper data handling and refresh
const StaffSection = () => {
  const { section, staffId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showIconMenu, setShowIconMenu] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger

  const keyMapping = {
    'بيانات اساسية': 'basic',
    'قائمة الموظفين': 'list',
    'تكليفات': 'assignments',
    'ترقيات': 'promotions',
    'تدريبات': 'training',
    'تقارير': 'reports',
    'أذون واجازات': 'leaves',
    'طباعة (إذن خروج /طلب إجازة /إخطار عارضة /خطاب تأمين صحى)': 'print'
  };
  
  // Updated field mapping for both Arabic and English
  const dbFieldMapping = {
    // English to Arabic mapping
    'studentId': 'رقم_الطالب', 
    'name': 'الاسم',
    'staffId': 'رقم_الموظف',
    'nationalId': 'الرقم_القومي',
    'position': 'الوظيفة',
    'department': 'القسم',
    'phone': 'الهاتف',
    'email': 'البريد_الالكتروني',
    'hireDate': 'تاريخ_التعيين',
    'address': 'العنوان',
    'maritalStatus': 'الحالة_الاجتماعية',
    'birthDate': 'تاريخ_الميلاد',
    'qualification': 'المؤهل',
    'salary': 'الراتب',
    'photo': 'صورة',
    'emergencyContact': 'جهة_الاتصال_الطوارئ',
    'emergencyPhone': 'رقم_هاتف_الطوارئ'
  };

  // Helper function to map Arabic fields to English
 const mapFieldsToEnglish = (data) => {
  const mappedData = {};
  
  // Handle both direct fields and nested basicData
  const mapSingleLevel = (source, target) => {
    Object.entries(source).forEach(([key, value]) => {
      // Handle Arabic number fields (like student IDs)
      if (typeof value === 'string' && /^[\d\u0660-\u0669]+$/.test(value)) {
        value = value.replace(/[\u0660-\u0669]/g, d => 
          '٠١٢٣٤٥٦٧٨٩'.indexOf(d)
        );
      }
      
      const englishKey = Object.keys(dbFieldMapping).find(
        englishKey => dbFieldMapping[englishKey] === key
      );
      
      if (englishKey) {
        target[englishKey] = value;
      } else {
        target[key] = value;
      }
    });
  };

  mapSingleLevel(data, mappedData);
  
  if (data.basicData) {
    mappedData.basicData = {};
    mapSingleLevel(data.basicData, mappedData.basicData);
  }
  
  return mappedData;
};

  // Updated fetchStaff function with better error handling
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'staff'));
      const querySnapshot = await getDocs(q);
      const staffData = querySnapshot.docs.map(doc => {
        const rawData = doc.data();
        const mappedData = mapFieldsToEnglish(rawData);
        
        return {
          id: doc.id,
          ...mappedData
        };
      });
      setStaff(staffData);
    } catch (error) {
      console.error("Error fetching staff:", error);
      // You might want to show a user-friendly error message here
    } finally {
      setLoading(false);
    }
  };

  // Fetch staff data on component mount and when refresh is triggered
  useEffect(() => {
    fetchStaff();
  }, [refreshTrigger]);

  // Function to trigger refresh
  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  

  // Reverse mapping for getting Arabic titles from English keys
  const reverseKeyMapping = Object.fromEntries(
    Object.entries(keyMapping).map(([arabic, english]) => [english, arabic])
  );

  const menuItems = [
    {
      key: 'basic',
      title: 'بيانات اساسية',
      icon: User,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
    },
    {
      key: 'assignments',
      title: 'تكليفات',
      icon: ClipboardList,
      color: 'bg-green-100 text-green-600 hover:bg-green-200'
    },
    {
      key: 'promotions',
      title: 'ترقيات',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200'
    },
    {
      key: 'training',
      title: 'تدريبات',
      icon: GraduationCap,
      color: 'bg-orange-100 text-orange-600 hover:bg-orange-200'
    },
    {
      key: 'reports',
      title: 'تقارير',
      icon: FileText,
      color: 'bg-red-100 text-red-600 hover:bg-red-200'
    },
    {
      key: 'leaves',
      title: 'أذون واجازات',
      icon: Calendar,
      color: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
    },
    {
      key: 'print',
      title: 'طباعة (إذن خروج /طلب إجازة /إخطار عارضة /خطاب تأمين صحى)',
      icon: Printer,
      color: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
    },
    {
      key: 'list',
      title: 'قائمة الموظفين',
      icon: Users,
      color: 'bg-teal-100 text-teal-600 hover:bg-teal-200'
    }
  ];

  const handleMenuItemClick = (key) => {
    setShowIconMenu(false);
    setActiveTab(key);
    navigate(`/staff/${key}`);
  };

  const handleBackToMenu = () => {
    setActiveTab(null);
    setShowIconMenu(true);
    navigate('/staff');
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      await deleteDoc(doc(db, 'staff', staffId));
      // Trigger refresh instead of manual state update
      triggerRefresh();
      console.log('Staff member deleted successfully');
    } catch (error) {
      console.error('Error deleting staff member:', error);
      throw error;
    }
  };

  // Handle successful form submission
  const handleStaffFormSuccess = () => {
    triggerRefresh();
    // Optionally navigate back to list
    if (section === 'basic') {
      navigate('/staff/list');
    }
  };

  const getFormName = (key) => {
    const item = menuItems.find(item => item.key === key);
    return item ? item.title : reverseKeyMapping[key] || key;
  };

  // Update forms object to include refresh callback
  const forms = {
    basic: (
      <StaffBasicDataForm 
        staffId={staffId} 
        onSuccess={handleStaffFormSuccess}
        onRefresh={triggerRefresh}
      />
    ),
    list: (
      <StaffList 
        staff={staff} 
        loading={loading} 
        onEditStaff={(id) => navigate(`/staff/basic/${id}`)}
        onDeleteStaff={handleDeleteStaff}
        onRefresh={triggerRefresh}
      />
    ),
    assignments: <div className="p-4 text-center text-gray-500">تكليفات - قيد التطوير</div>,
    promotions: <div className="p-4 text-center text-gray-500">ترقيات - قيد التطوير</div>,
    training: <div className="p-4 text-center text-gray-500">تدريبات - قيد التطوير</div>,
    reports: <div className="p-4 text-center text-gray-500">تقارير - قيد التطوير</div>,
    leaves: <div className="p-4 text-center text-gray-500">أذون واجازات - قيد التطوير</div>,
    print: <div className="p-4 text-center text-gray-500">طباعة - قيد التطوير</div>
  };

  // Update activeTab based on URL section
  useEffect(() => {
    if (section) {
      setActiveTab(section);
      setShowIconMenu(false);
    } else {
      setShowIconMenu(true);
      setActiveTab(null);
    }
  }, [section]);

  return (
    <div>
      <div className="bg-green-600 p-4 text-white mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">إدارة شئون الموظفين</h2>
          {section && (
            <p className="text-green-100 text-sm mt-1">
              القسم الحالي: {reverseKeyMapping[section] || section}
              {staffId && ` - معرف الموظف: ${staffId}`}
            </p>
          )}
        </div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
        // Form View with Breadcrumbs
        <div className="p-4">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
            <button 
              onClick={handleBackToMenu}
              className="text-green-600 hover:text-green-800"
            >
              شئون الموظفين
            </button>
            {section && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-800 font-medium">
                  {reverseKeyMapping[section] || section}
                </span>
              </>
            )}
            {staffId && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-600">معرف الموظف: {staffId}</span>
              </>
            )}
          </div>

          <div className="flex overflow-x-auto mb-4">
            {Object.keys(forms).map(key => (
              <button
                key={key}
                onClick={() => navigate(`/staff/${key}${staffId ? `/${staffId}` : ''}`)}
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

export default Staff;
export { StaffSection };