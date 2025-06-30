import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';

const YearWorkForm = ({ grade }) => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    address: '',
    parentName: '',
    parentPhone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, `grade_${grade}_year_work`), {
        ...formData,
        createdAt: new Date()
      });
      alert('تم حفظ البيانات بنجاح');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium">البيانات الأساسية للصف {grade}</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">اسم الطالب</label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      
      {/* Add other form fields similarly */}
      
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        حفظ البيانات
      </button>
    </form>
  );
};

export default YearWorkForm