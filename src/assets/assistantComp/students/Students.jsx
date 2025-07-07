
import { useState, useEffect } from 'react';
import { useParams, Routes, useNavigate, Link, Outlet } from 'react-router-dom';
import { collection, query, getDocs, where, arrayUnion, writeBatch, doc, updateDoc, addDoc,serverTimestamp   } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';
import BasicDataForm from './studensForms/BasicDataForm'
import ClassListsForm from './studensForms/ClassListsForm'
import YearWorkForm from './studensForms/YearWorkForm'
import AttendanceForm from './studensForms/AttendanceForm'
import ActivitiesForm from './studensForms/ActivitiesForm'
import PaymentsForm from './studensForms/PaymentsForm'
import PrintForms from './studensForms/PrintForms'
// import StudentList from './StudentList';
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
import ListStudents from './studensForms/TempStudent';

// import { useNavigate } from 'react-router-dom';





const GradeSection = () => {
   const navigate = useNavigate();
  const { grade, studentId } = useParams()
  const [activeTab, setActiveTab] = useState(studentId ? 'basic' : 'list');
  const [showIconMenu, setShowIconMenu] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    if (studentId) {
      setActiveTab('basic');
      setShowIconMenu(false);
    }
  }, [studentId]);

  const arabicGradeNames = {
    'first': 'الأول',
    'second': 'الثاني',
    'third': 'الثالث'
  };

  const handleMenuItemClick = (key) => {
    setActiveTab(key);
    setShowIconMenu(false);
  };

  // FIXED: Handle edit without navigation
  const handleEdit = (student) => {
    setEditingStudent(student);
    setActiveTab('basic'); // Switch to basic tab (add/edit form)
    setShowIconMenu(false); // Show the form view
  };

  // FIXED: Handle add new student
  const handleAddNew = () => {
    setEditingStudent(null); // Clear editing student for new student
    setActiveTab('basic'); // Switch to basic tab
    setShowIconMenu(false); // Show the form view
  };

  const handleSave = async (data) => {
   const now = new Date();
  const readableDate = now.toLocaleString('en-US');
  const arabicDate = now.toLocaleDateString('ar-EG');
  
  try {
    if (data.id) {
      // EDITING existing student
      const ref = doc(db, "students", data.id);
      const { id, ...rest } = data;
      
      const updatedData = {
        ...rest,
        updatedDate: serverTimestamp(), // Firestore server timestamp
        updatedDateReadable: readableDate,
        updatedDateArabic: arabicDate,
      };
      
      await updateDoc(ref, updatedData);
      
    } else {
      // ADDING new student
      const newStudentData = {
        ...data,
        createdDate: serverTimestamp(), // Firestore server timestamp
        createdDateReadable: readableDate,
        createdDateArabic: arabicDate,
        updatedDate: serverTimestamp(),
        updatedDateReadable: readableDate,
        updatedDateArabic: arabicDate,
      };
      
      await addDoc(collection(db, "students"), newStudentData);
    }
    setEditingStudent(null);
    setActiveTab('list'); // Go back to student list
    // No navigation needed - stay in GradeSection
  }catch (error) {
    console.error('Error saving student:', error);
    alert('حدث خطأ أثناء حفظ بيانات الطالب');
  }
};

  const handleCancel = () => {
    setEditingStudent(null);
    setActiveTab('list'); // Go back to student list
  };

  const getFormName = (key) => {
    const item = menuItems.find(item => item.key === key);
    return item ? item.title : key;
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

  const forms = {
    basic: <AddOrEditStudent
      existingData={editingStudent}
      onSave={handleSave}
      onCancel={handleCancel}
    />,
    list: <ListStudents onEdit={handleEdit} onAddNew={handleAddNew} />,
    classes: <div className="p-4 text-center text-gray-500">قوائم الفصول - قيد التطوير</div>,
    yearWork: <div className="p-4 text-center text-gray-500">كشوف أعمال السنة - قيد التطوير</div>,
    attendance: <div className="p-4 text-center text-gray-500">كشوف الغياب - قيد التطوير</div>,
    activities: <div className="p-4 text-center text-gray-500">كشوف الأنشطة - قيد التطوير</div>,
    payments: <div className="p-4 text-center text-gray-500">تسجيل سداد المصروفات - قيد التطوير</div>,
    print: <div className="p-4 text-center text-gray-500">طباعة - قيد التطوير</div>,
    statistics: <div className="p-4 text-center text-gray-500">احصائية الصف - قيد التطوير</div>
  };

 const handleBackToMenu = () => {
    setActiveTab(null);
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
            <Outlet />
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
                className={`px-4 py-2 mx-1 rounded-t-lg whitespace-nowrap ${activeTab === key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'
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



export default GradeSection;
