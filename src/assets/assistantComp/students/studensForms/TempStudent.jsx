import { db } from '../../../../services/firebaseConfig';
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


const ListStudents = ({ onEdit,onAddNew  }) => {
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
       {console.log(result.length)}
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
    onEdit(student); // Set the editing student in parent state
    navigate("/students/edit"); // Navigate to edit route
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div dir="rtl" className="max-w-4xl mx-auto p-4">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">قائمة الطلاب</h2>
       <button
  onClick={() => onAddNew()} // Use onAddNew instead of navigate
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition-all"
>
  ➕ إضافة طالب جديد
</button>
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
          <button
            onClick={() => handleEdit(stu)}
            className="text-blue-600 hover:underline"
          >
            ✏️ تعديل
          </button>
        </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
export default ListStudents;
