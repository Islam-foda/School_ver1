import { Link } from "react-router-dom";

const StudentList = ({ students, loading, onEditStudent }) => {
  if (loading) return <div className="p-4 text-center">جاري تحميل بيانات الطلاب...</div>;
  if (!students?.length) return <div className="p-4 text-center text-gray-500">لا يوجد طلاب مسجلين</div>;

  return (
    <div className="space-y-3">
      {students.map(student => {
        const studentData = student.basicData || student;
        
        return (
          <div key={student.id} className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm">
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">
                {studentData.name || 'بدون اسم'}
              </h3>
              <div className="flex gap-4 mt-1 text-sm text-gray-600">
                {studentData.nationalId && (
                  <span>الرقم القومي: {studentData.nationalId}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => onEditStudent(student.id)}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-sm whitespace-nowrap"
            >
              تعديل البيانات
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default StudentList