// import { useState } from 'react';
// import { collection, addDoc } from 'firebase/firestore';
// import { db } from '../../services/firebaseConfig';




const PrintForms = () => {
  const printOptions = [
    'بيان قيد',
    'طلب تحويل طالب',
    'إذن خروج'
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">طباعة مستندات</h3>
      <div className="grid grid-cols-1 gap-3">
        {printOptions.map(option => (
          <button
            key={option}
            onClick={() => window.print()} // Or implement specific print logic
            className="bg-white border border-blue-500 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50"
            >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
export default PrintForms