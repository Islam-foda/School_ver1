import { db } from '../../../../services/firebaseConfig';
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


const ListStudents = () => {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    grade: "",
    class: "",
    year: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let q = collection(db, "students");
      const conditions = [];
      if (filters.grade) conditions.push(where("grade", "==", filters.grade));
      if (filters.class) conditions.push(where("class", "==", filters.class));
      if (filters.year) conditions.push(where("year", "==", filters.year));
      if (filters.name) conditions.push(where("firstName", "==", filters.name));
      if (conditions.length > 0) {
        q = query(q, ...conditions);
      }

      const querySnapshot = await getDocs(q);
      const result = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(result);
    } catch (err) {
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const handleEdit = (student) => {
    navigate(`/students/edit/${student.id}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذا الطالب؟')) return;
    try {
      await deleteDoc(doc(db, 'students', studentId));
      setStudents((prev) => prev.filter((stu) => stu.id !== studentId));
    } catch (err) {
      alert('حدث خطأ أثناء حذف الطالب');
      console.error('Error deleting student:', err);
    }
  };

  return (
    <div dir="rtl" className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">قائمة الطلاب</h2>
      
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <input
          name="name"
          placeholder="الاسم"
          value={filters.name}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md text-sm"
        />
        <input
          name="grade"
          placeholder="الصف"
          value={filters.grade}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md text-sm"
        />
        <input
          name="class"
          placeholder="الفصل"
          value={filters.class}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md text-sm"
        />
        <input
          name="year"
          placeholder="السنة"
          value={filters.year}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md text-sm"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">جاري التحميل...</p>
      ) : (
        <div className="space-y-4">
          {students.length === 0 ? (
            <p className="text-center text-gray-400">لا يوجد طلاب</p>
          ) : (
            students.map((stu) => (
              <div
                key={stu.id}
                className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-medium">{stu.firstName} {stu.lastName}</h3>
                  <p className="text-sm text-gray-500">الصف: {stu.grade} | الفصل: {stu.class}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(stu)}
                    className="text-blue-600 hover:underline"
                  >
                    ✏️ تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(stu.id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑️ حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
export default ListStudents;
