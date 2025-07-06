import { useState, useEffect } from "react";
import { db } from '../../../services/firebaseConfig'; // adjust path as needed
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";

const BasicDataForm = ({ existingData = null, onSave, onClick}) => {
  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
    grade: "",
    class: "",
    year: new Date().getFullYear(),
    gender: "",
    dob: "",
    parentContact: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingData) {
      setStudent(existingData);
    }
  }, [existingData]);

  const validate = () => {
    const newErrors = {};
    if (!student.firstName) newErrors.firstName = "الاسم الأول مطلوب";
    if (!student.lastName) newErrors.lastName = "الاسم الأخير مطلوب";
    if (!student.grade || student.grade < 1 || student.grade > 3) newErrors.grade = "الصف الدراسي غير صالح";
    if (!student.class) newErrors.class = "الفصل مطلوب";
    if (!student.gender) newErrors.gender = "النوع مطلوب";
    if (!student.dob) newErrors.dob = "تاريخ الميلاد مطلوب";
    if (!student.parentContact || !/^01[0125][0-9]{8}$/.test(student.parentContact)) newErrors.parentContact = "رقم ولي الأمر غير صالح";
    if (!student.address) newErrors.address = "العنوان مطلوب";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (existingData) {
        const docRef = doc(db, "students", existingData.id);
        await updateDoc(docRef, {
          ...student,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "students"), {
          ...student,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      if (onSave) onSave();
      alert("✅ تم الحفظ بنجاح");
      setStudent({
        firstName: "",
        lastName: "",
        grade: "",
        class: "",
        year: new Date().getFullYear(),
        gender: "",
        dob: "",
        parentContact: "",
        address: "",
      });
    } catch (error) {
      console.error("❌ خطأ أثناء الحفظ:", error);
    }
  };

  return (
  <form 
    onSubmit={handleSubmit} 
    dir="rtl" 
    className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
      {existingData ? "تعديل بيانات الطالب" : "إضافة طالب جديد"}
    </h2>

    <div className="space-y-4">
      {/* First Name */}
      <div>
        <label className="block text-gray-700 mb-1">الاسم الأول:</label>
        <input 
          name="firstName" 
          value={student.firstName} 
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-gray-700 mb-1">الاسم الأخير:</label>
        <input 
          name="lastName" 
          value={student.lastName} 
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
      </div>

      {/* Grade */}
      <div>
        <label className="block text-gray-700 mb-1">الصف الدراسي:</label>
        <input 
          name="grade" 
          type="number" 
          value={student.grade} 
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.grade && <span className="text-red-500 text-sm">{errors.grade}</span>}
      </div>

      {/* Class */}
      <div>
        <label className="block text-gray-700 mb-1">الفصل:</label>
        <input 
          name="class" 
          value={student.class} 
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.class && <span className="text-red-500 text-sm">{errors.class}</span>}
      </div>

      {/* Year */}
      <div>
        <label className="block text-gray-700 mb-1">السنة الدراسية:</label>
        <input 
          name="year" 
          type="number" 
          value={student.year} 
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-gray-700 mb-1">النوع:</label>
        <select 
          name="gender" 
          value={student.gender} 
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">اختر النوع</option>
          <option value="ذكر">ذكر</option>
          <option value="أنثى">أنثى</option>
        </select>
        {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-gray-700 mb-1">تاريخ الميلاد:</label>
        <input 
          name="dob" 
          type="date" 
          value={student.dob} 
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.dob && <span className="text-red-500 text-sm">{errors.dob}</span>}
      </div>

      {/* Parent Contact */}
      <div>
        <label className="block text-gray-700 mb-1">رقم ولي الأمر:</label>
        <input 
          name="parentContact" 
          value={student.parentContact} 
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.parentContact && <span className="text-red-500 text-sm">{errors.parentContact}</span>}
      </div>

      {/* Address */}
      <div>
        <label className="block text-gray-700 mb-1">العنوان:</label>
        <input 
          name="address" 
          value={student.address} 
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
      </div>

      {/* Submit Button */}
    <div className="pt-4 flex gap-3">
  <button 
    type="submit"
    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
  >
    <span className="ml-2">💾</span>
    حفظ
  </button>
  <button 
    onClick={onClick} 
    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
  >
    <span className="ml-2">❌</span>
    إلغاء
  </button>
</div>
    </div>
  </form>
);
};

export default BasicDataForm;
