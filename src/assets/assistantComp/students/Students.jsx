
import { useState, useEffect } from 'react';
import { useParams, Routes, useNavigate, Link, Outlet } from 'react-router-dom';
import { collection, query, getDocs, where, arrayUnion, writeBatch } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';
import ClassListsForm from './studensForms/ClassListsForm'
import YearWorkForm from './studensForms/YearWorkForm'
import AttendanceForm from './studensForms/AttendanceForm'
import ActivitiesForm from './studensForms/ActivitiesForm'
import PaymentsForm from './studensForms/PaymentsForm'
import PrintForms from './studensForms/PrintForms'
// import StudentList from './StudentList';
import ListStudents from './studensForms/TempStudent';
import AddOrEditStudent from './studensForms/AddOrEditStudent';
import {
  User,
  Users,
  FileText,
  Calendar,
  Activity,
  CreditCard,
  Printer,
  BarChart3, ArrowUp
} from 'lucide-react';






const GradeSection = () => {
  const navigate = useNavigate();
  const { grade, studentId } = useParams();
  const [showIconMenu, setShowIconMenu] = useState(true);

  useEffect(() => {
    if (studentId) {
      setShowIconMenu(false);
    }
  }, [studentId]);

  const arabicGradeNames = {
    'first': 'الأول',
    'second': 'الثاني',
    'third': 'الثالث'
  };

  const handleMenuItemClick = (key) => {
    // Route to the appropriate path based on key
    if (key === 'list') {
      navigate('/students/list');
    } else if (key === 'basic') {
      navigate('/students/edit');
    } else if (key === 'promote') {
      handlePromoteStudents();
      return;
    } else {
      // For other keys, just show a placeholder or do nothing
      alert('هذه الميزة قيد التطوير');
      return;
    }
    setShowIconMenu(false);
  };

  const handlePromoteStudents = async () => {
    try {
      const q = query(
        collection(db, 'students'),
        where('currentGrade', '==', grade),
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(q);

      const nextGrade = {
        'first': 'second',
        'second': 'third',
        'third': 'graduate'
      }[grade];

      const batch = writeBatch(db);
      querySnapshot.forEach(doc => {
        const studentRef = doc.ref;
        batch.update(studentRef, {
          currentGrade: nextGrade,
          previousGrades: arrayUnion(grade)
        });
      });

      await batch.commit();
      alert(`تم ترقية الطلاب بنجاح إلى الصف ${arabicGradeNames[nextGrade] || 'التخرج'}`);
    } catch (error) {
      console.error('Error promoting students:', error);
      alert('حدث خطأ أثناء محاولة ترقية الطلاب');
    }
  };

  const menuItems = [
    {
      key: 'basic',
      title: 'البيانات الأساسية',
      icon: User,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
    }, {
      key: 'list',
      title: 'قوائم الطلاب',
      icon: User,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
    },
    {
      key: 'classes',
      title: 'قوائم الفصول',
      icon: Users,
      color: 'bg-green-100 text-green-600 hover:bg-green-200'
    },
    {
      key: 'yearWork',
      title: 'كشوف أعمال السنة',
      icon: FileText,
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200'
    },
    {
      key: 'attendance',
      title: 'كشوف الغياب',
      icon: Calendar,
      color: 'bg-red-100 text-red-600 hover:bg-red-200'
    },
    {
      key: 'activities',
      title: 'كشوف الأنشطة',
      icon: Activity,
      color: 'bg-orange-100 text-orange-600 hover:bg-orange-200'
    },
    {
      key: 'payments',
      title: 'تسجيل سداد المصروفات',
      icon: CreditCard,
      color: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
    },
    {
      key: 'print',
      title: 'طباعة (بيان قيد /طلب تحويل طالب /إذن خروج)',
      icon: Printer,
      color: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
    },
    {
      key: 'statistics',
      title: 'احصائية الصف',
      icon: BarChart3,
      color: 'bg-teal-100 text-teal-600 hover:bg-teal-200'
    }, {
      key: 'promote',
      title: 'ترقية الطلاب',
      icon: ArrowUp,
      color: 'bg-green-100 text-green-600 hover:bg-green-200',
      onClick: handlePromoteStudents
    }
  ];

  const handleBackToMenu = () => {
    setShowIconMenu(true);
    navigate('/students');
  };

  return (
    <div>
      <div className="bg-green-600 p-4 text-white mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">إدارة شئون الطلاب</h2>
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
        // Nested Route View
        <div className="p-4">
          <Outlet />
        </div>
      )}
    </div>
  );
};



export default GradeSection;
