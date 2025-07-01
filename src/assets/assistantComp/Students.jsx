
import {  useState,useEffect } from 'react';
import { useParams, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';
import BasicDataForm from './BasicDataForm'
import ClassListsForm from './ClassListsForm'
import YearWorkForm from './YearWorkForm'
import AttendanceForm from './AttendanceForm'
import ActivitiesForm from './ActivitiesForm'
import PaymentsForm from './PaymentsForm'
import PrintForms from './PrintForms'
import StudentList from './StudentList';
import {  collection, query, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { 
  User, 
  Users, 
  FileText, 
  Calendar, 
  Activity, 
  CreditCard, 
  Printer, 
  BarChart3 
} from 'lucide-react';





const Students = () => {
 const grades = ['الأول', 'الثاني', 'الثالث']; // Add more grades if needed
const gradeMapping = {
    'الأول': 'first',
    'الثاني': 'second',
    'الثالث': 'third'
    // Add more mappings if needed
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">شئون الطلاب</h1>
      
      {/* Grade Navigation */}
      <div className="flex space-x-4 mb-6">
        {grades.map(grade => (
          <Link 
            key={grade}
            to={`/students/${gradeMapping[grade]}`}
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
          >
            الصف {grade}
          </Link>
        ))}
      </div>
      
      {/* Grade Content Area */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <Outlet /> 
      </div>
    </div>
  );
};

const GradeSection = () => {
  const {grade,studentId} = useParams()
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(studentId ? 'basic' : 'list');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showIconMenu, setShowIconMenu] = useState(true);

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
    // Add more mappings if needed
  };

useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, `grade_${grade}_students`));
        const querySnapshot = await getDocs(q);
        const studentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          ...(doc.data().basicData || {})
        }));
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, [grade]);

 const menuItems = [
    {
      key: 'basic',
      title: 'البيانات الأساسية',
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
    }
  ];

  const handleMenuItemClick = (key) => {
    setActiveTab(key);
    setShowIconMenu(false);
  };

const handleDeleteStudent = async (studentId) => {
  try {
    // Delete the student document from Firestore
    await deleteDoc(doc(db, `grade_${grade}_students`, studentId));
    
    // Update the local state to remove the deleted student
    setStudents(prevStudents => 
      prevStudents.filter(student => student.id !== studentId)
    );
    
    console.log('Student deleted successfully');
    // You might want to show a success message to the user
    
  } catch (error) {
    console.error('Error deleting student:', error);
    // You might want to show an error message to the user
    throw error; // Re-throw to let the StudentList component handle the error state
  }
};

  const handleBackToMenu = () => {
    setActiveTab(null);
    setShowIconMenu(true);
  };

  const getFormName = (key) => {
    const item = menuItems.find(item => item.key === key);
    return item ? item.title : key;
  };

  const forms = {
    basic: <BasicDataForm grade={arabicGradeNames[grade]} gradeDB={grade} />,
    list: <StudentList students={students} gradeDB={grade} loading={loading} onEditStudent={(id) => navigate(`/students/${grade}/${id}`)} onDeleteStudent={handleDeleteStudent} />,
    // Add other forms as needed
    classes: <div className="p-4 text-center text-gray-500">قوائم الفصول - قيد التطوير</div>,
    yearWork: <div className="p-4 text-center text-gray-500">كشوف أعمال السنة - قيد التطوير</div>,
    attendance: <div className="p-4 text-center text-gray-500">كشوف الغياب - قيد التطوير</div>,
    activities: <div className="p-4 text-center text-gray-500">كشوف الأنشطة - قيد التطوير</div>,
    payments: <div className="p-4 text-center text-gray-500">تسجيل سداد المصروفات - قيد التطوير</div>,
    print: <div className="p-4 text-center text-gray-500">طباعة - قيد التطوير</div>,
    statistics: <div className="p-4 text-center text-gray-500">احصائية الصف - قيد التطوير</div>
  };

  return (
    <div>
      <div className="bg-blue-600 p-4 text-white mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">سجل قيد الصف {arabicGradeNames[grade]}</h2>
        {!showIconMenu && (
          <button
            onClick={handleBackToMenu}
            className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded text-sm"
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
        // Form View
        <div className="p-4">
          <div className="flex overflow-x-auto mb-4">
            {Object.keys(forms).map(key => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 mx-1 rounded-t-lg whitespace-nowrap ${
                  activeTab === key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'
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



export default Students;
export { GradeSection };
