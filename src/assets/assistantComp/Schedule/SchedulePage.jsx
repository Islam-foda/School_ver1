import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { db } from '../../../services/firebaseConfig';
import { collection, getDocs } from "firebase/firestore";

const days = [
  { key: 'sat', label: 'السبت' },
  { key: 'sun', label: 'الأحد' },
  { key: 'mon', label: 'الاثنين' },
  { key: 'tue', label: 'الثلاثاء' },
  { key: 'wed', label: 'الأربعاء' },
  { key: 'thu', label: 'الخميس' },
];
const periods = [1, 2, 3, 4, 5, 6, 7];

const SchedulePage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "classes"));
        const classList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClasses(classList);
        if (classList.length > 0) setSelectedClass(classList[0].id);
        setError(null);
      } catch {
        setError("فشل تحميل بيانات الفصول");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const selected = classes.find(cls => cls.id === selectedClass);

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6 flex flex-col md:flex-row md:items-center md:justify-between text-center md:text-right">
        <div className="flex items-center justify-center md:justify-end w-full md:w-auto mb-4 md:mb-0">
          <Calendar className="w-16 h-16 text-purple-600 ml-4" />
          <h2 className="text-2xl font-bold text-gray-900">الجدول الدراسي</h2>
        </div>
        <div className="flex items-center justify-center gap-2 w-full md:w-auto">
          <label htmlFor="classDropdown" className="text-gray-700 font-medium">اختر الفصل:</label>
          {loading ? (
            <div className="text-gray-500">جاري التحميل...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <select
              id="classDropdown"
              className="border rounded-md px-4 py-2 text-right"
              value={selectedClass || ''}
              onChange={e => setSelectedClass(e.target.value)}
            >
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.className || cls.id}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      {selected && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-200 text-center">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">اليوم \ الحصة</th>
                {periods.map(period => (
                  <th key={period} className="py-2 px-4 border-b">الحصة {period}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map(day => (
                <tr key={day.key}>
                  <td className="py-2 px-4 border-b font-bold bg-gray-50">{day.label}</td>
                  {periods.map(period => {
                    const field = `${day.key}${period}`;
                    const value = selected[field] || '';
                    return (
                      <td key={field} className="py-2 px-4 border-b">
                        {value ? <span className="font-semibold text-blue-700">{value}</span> : <span className="text-gray-300">—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SchedulePage; 