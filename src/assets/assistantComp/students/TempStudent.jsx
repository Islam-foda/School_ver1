import { db } from '../../../services/firebaseConfig';
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import BasicDataForm from './StudentForm';


const ListStudents = () => {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    grade: "",
    class: "",
    year: "",
    studentId: "",
  });

  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let q = collection(db, "students");

      const conditions = [];
      if (filters.grade) conditions.push(where("grade", "==", Number(filters.grade)));
      if (filters.class) conditions.push(where("class", "==", filters.class));
      if (filters.year) conditions.push(where("year", "==", Number(filters.year)));

      if (conditions.length > 0) {
        q = query(q, ...conditions);
      }

      const querySnapshot = await getDocs(q);
      let result = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Apply client-side filter for studentId if needed
      if (filters.studentId) {
        result = result.filter((stu) =>
          stu.id.toLowerCase().includes(filters.studentId.toLowerCase())
        );
      }

      setStudents(result);
    } catch (error) {
      console.error("حدث خطأ أثناء تحميل الطلاب:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsAdding(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSave = () => {
    setEditingStudent(null);
    setIsAdding(false);
    fetchStudents(); // 🔄 Refresh list
  };

  const handleCancel = () => {
    setEditingStudent(null);
    setIsAdding(false);
  };

  const handleAddNew = () => {
    setEditingStudent(null);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <div dir="rtl" className="p-4 max-w-5xl mx-auto">
      <div className="mb-4">
        <button
          onClick={handleAddNew}
          className="text-base px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
        >
          ➕ إضافة طالب جديد
        </button>
      </div>
      {(editingStudent || isAdding) && (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="ml-2">📝</span>
            {editingStudent ? "📝 تعديل بيانات الطالب" : "➕ إضافة طالب جديد"}
          </h2>
          <BasicDataForm existingData={editingStudent} onSave={handleFormSave} onClick={handleCancel} />

          <hr className="my-6 border-gray-200" />
        </>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="ml-2">📋</span>
        قائمة الطلاب
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-gray-700 mb-1">الصف الدراسي:</label>
          <input
            name="grade"
            value={filters.grade}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-gray-700 mb-1">الفصل:</label>
          <input
            name="class"
            value={filters.class}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-gray-700 mb-1">السنة الدراسية:</label>
          <input
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-gray-700 mb-1">رقم الطالب:</label>
          <input
            name="studentId"
            value={filters.studentId}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 flex items-center justify-center">
            <span className="ml-2">⏳</span>
            جاري التحميل...
          </p>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">لا يوجد طلاب مطابقين للبحث</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-right border-b border-gray-200">الاسم</th>
                <th className="px-6 py-3 text-right border-b border-gray-200">الصف</th>
                <th className="px-6 py-3 text-right border-b border-gray-200">الفصل</th>
                <th className="px-6 py-3 text-right border-b border-gray-200">السنة</th>
                <th className="px-6 py-3 text-right border-b border-gray-200">النوع</th>
                <th className="px-6 py-3 text-right border-b border-gray-200">رقم الطالب</th>
                <th className="px-6 py-3 text-right border-b border-gray-200">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu) => (
                <tr key={stu.id} className="hover:bg-gray-50 even:bg-gray-50">
                  <td className="px-6 py-4 border-b border-gray-200">{stu.firstName} {stu.lastName}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{stu.grade}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{stu.class}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{stu.year}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{stu.gender}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{stu.id}</td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <button
                      onClick={() => handleEdit(stu)}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      <span className="ml-1">✏️</span>
                      تعديل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListStudents;
