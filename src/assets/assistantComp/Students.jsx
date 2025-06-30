
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
import {  collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';





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

  useEffect(() => {
    if (studentId) {
      setActiveTab('basic');
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

 const getFormName = (key) => {
    const formNames = {
      'basic': 'البيانات الأساسية',
      'list':'قائمة الطلاب',
      'classes': 'الفصول',
      'yearWork': 'أعمال السنة',
      'attendance': 'الحضور',
      'activities': 'الأنشطة',
      'payments': 'المدفوعات',
      'print': 'طباعة'
    };
    return formNames[key] || key;
  };

  const forms = {
    basic: <BasicDataForm grade={arabicGradeNames[grade]} gradeDB={grade} />,
    list: <StudentList students={students} gradeDB={grade} loading={loading} onEditStudent={(id) => navigate(`/students/${grade}/${id}`)}/>
    // classes: <ClassListsForm grade={grade} gradeDB={gradeDB} />,
    // yearWork: <YearWorkForm grade={grade} gradeDB={gradeDB}/>,
    // attendance: <AttendanceForm grade={grade} gradeDB={gradeDB}/>,
    // activities: <ActivitiesForm grade={grade} gradeDB={gradeDB} />,
    // payments: <PaymentsForm grade={grade} gradeDB={gradeDB}/>,
    // print: <PrintForms grade={grade} gradeDB={gradeDB} />
  };

  return (
  <div>
      <div className="bg-blue-600 p-4 text-white mb-4">
        <h2 className="text-xl font-semibold">سجل قيد الصف {arabicGradeNames[grade]}</h2>
      </div>
      
      <div className="p-4">
        <div className="flex overflow-x-auto mb-4">
          {Object.keys(forms).map(key => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 mx-1 rounded-t-lg ${activeTab === key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
            >
              {getFormName(key)}
            </button>
          ))}
        </div>
        
        <div className="border rounded-lg p-4">
          {forms[activeTab]}
        </div>
      </div>
      <div>
      {/* ... other components ... */}
      
    </div>
    </div>
  );
};



export default Students;
export { GradeSection };
