import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';

const BasicDataForm = ({ gradeDB }) => {
  // grade: Arabic grade name (for display)
  // gradeDB: English grade name (for database operations)
  const navigate = useNavigate();
  const { grade, studentId } = useParams(); // For edit mode
  const [searchId, setSearchId] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthPlace: '',
    gender: 'ذكر',
    nationality: 'مصري',
    religion: 'مسلم',
    nationalId: '',
    address: '',
    city: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  // Fetch existing data in edit mode
  useEffect(() => {
    if (!studentId) return;

    if (studentId) {
      const fetchStudentData = async () => {
        setIsLoading(true);
        try {
          const docRef = doc(db, `grade_${gradeDB}_students`, studentId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setFormData(docSnap.data().basicData);
            setIsEditMode(true);
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchStudentData();
    }
  }, [studentId, gradeDB]);

  // Search student by national ID
  const searchStudentByNationalId = async (nationalId) => {
    if (!nationalId || nationalId.length !== 14) {
      alert("الرجاء إدخال رقم قومي صحيح (14 رقمًا)");
      return;
    }

    try {
      setIsLoading(true);
      const q = query(
        collection(db, `grade_${gradeDB}_students`),
        where("basicData.nationalId", "==", nationalId)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert("لا يوجد طالب بهذا الرقم القومي");
        return;
      }

      // Get the first matching document
      const doc = querySnapshot.docs[0];
      setFormData(doc.data().basicData);
      setIsEditMode(true);
      setSearchId(''); // Clear search field
    } catch (error) {
      console.error("Error searching student:", error);
      alert("حدث خطأ أثناء البحث");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'يجب إدخال الاسم';
    } else if (!validateArabicName(formData.name)) {
      newErrors.name = 'يجب إدخال الاسم باللغة العربية';
    }

    // National ID validation
    if (!formData.nationalId) {
      newErrors.nationalId = 'يجب إدخال الرقم القومي';
    } else if (!/^[0-9]{14}$/.test(formData.nationalId)) {
      newErrors.nationalId = 'يجب أن يتكون الرقم القومي من 14 رقمًا';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'يجب إدخال رقم الهاتف';
    } else if (!/^[0-9]{11}$/.test(formData.phone)) {
      newErrors.phone = 'يجب أن يتكون رقم الهاتف من 11 رقمًا';
    }

    // Birth date validation
    if (!formData.birthDate) {
      newErrors.birthDate = 'يجب إدخال تاريخ الميلاد';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateArabicName = (name) => {
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;
    return arabicRegex.test(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isEditMode) {
        // Validate we have a studentId and the document exists
        if (!studentId) {
          throw new Error("لم يتم تحديد طالب للتعديل");
        }

        // Check if document exists before updating
        const docRef = doc(db, `grade_${gradeDB}_students`, studentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData({
            ...docSnap.data().basicData,
            studentId: docSnap.id  // Ensure studentId is included
          });
        }
        if (!docSnap.exists()) {
          throw new Error("الطالب غير موجود في قاعدة البيانات");
        }

        // Proceed with update
        await updateDoc(docRef, {
          'basicData': formData,
          'updatedAt': serverTimestamp()
        });
        alert("تم تحديث البيانات بنجاح");
      } else {
        // Create new document
        const newDocRef = doc(collection(db, `grade_${gradeDB}_students`));
        await setDoc(newDocRef, {
          basicData: formData,
          studentId: newDocRef.id,
          grade: gradeDB,
          arabicGrade: grade,
          class: '',
          enrollmentDate: new Date().toISOString().split('T')[0],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        alert("تم حفظ البيانات بنجاح");

        // Reset form after successful creation
        if (!studentId) {
          setFormData({
            name: '',
            birthDate: '',
            birthPlace: '',
            gender: 'ذكر',
            nationality: 'مصري',
            religion: 'مسلم',
            nationalId: '',
            address: '',
            city: '',
            phone: '',
          });
        }
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert(`حدث خطأ: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="search-student p-4 bg-gray-50">
        <div className="flex items-center gap-2">
          <label className="font-medium">ابحث بالرقم القومي:</label>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="أدخل الرقم القومي (14 رقمًا)"
            className="px-3 py-2 border rounded flex-1"
            maxLength="14"
          />
          <button
            onClick={() => searchStudentByNationalId(searchId)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'جاري البحث...' : 'بحث'}
          </button>
        </div>
      </div>

      <h2 className="bg-green-600 p-4 text-white text-lg font-semibold">
        البيانات الأساسية للطالب - الصف {grade} {isEditMode ? '(تعديل)' : '(جديد)'}
      </h2>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate(`/students/${gradeDB}`)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            ← العودة للقائمة
          </button>
        </div>
        {/* Personal Information Section */}
        <fieldset className="mb-6 border p-4 rounded">
          <legend className="px-2 font-semibold">المعلومات الشخصية</legend>

          <div className="mb-4">
            <label className="block mb-1 font-medium">الاسم بالعربية*:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">تاريخ الميلاد*:</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded ${errors.birthDate ? 'border-red-500' : ''}`}
              />
              {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">مكان الميلاد:</label>
              <input
                type="text"
                name="birthPlace"
                value={formData.birthPlace}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">الجنس*:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              >
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">الجنسية*:</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">الديانة*:</label>
            <select
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="مسلم">مسلم</option>
              <option value="مسيحي">مسيحي</option>
              <option value="أخرى">أخرى</option>
            </select>
          </div>
        </fieldset>

        {/* Identification Section */}
        <fieldset className="mb-6 border p-4 rounded">
          <legend className="px-2 font-semibold">معلومات الهوية</legend>

          <div className="mb-4">
            <label className="block mb-1 font-medium">الرقم القومي*:</label>
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              required
              maxLength="14"
              className={`w-full px-3 py-2 border rounded ${errors.nationalId ? 'border-red-500' : ''}`}
            />
            {errors.nationalId && <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">عنوان السكن*:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">المدينة*:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">رقم الهاتف*:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                maxLength="11"
                className={`w-full px-3 py-2 border rounded ${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>
        </fieldset>

        <div className="flex justify-end gap-3 mt-6">
          {isEditMode && (
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              onClick={() => window.history.back()}
            >
              رجوع
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {isLoading ? 'جاري الحفظ...' : 'حفظ البيانات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicDataForm;

