import { Link } from "react-router-dom";
import React, { useState } from 'react';
import { Trash2, Edit } from 'lucide-react';

const StudentList = ({ students, loading, onEditStudent, onDeleteStudent }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(null);

  if (loading) return <div className="p-4 text-center">جاري تحميل بيانات الطلاب...</div>;
  if (!students?.length) return <div className="p-4 text-center text-gray-500">لا يوجد طلاب مسجلين</div>;

  const handleDeleteClick = (studentId, studentName) => {
    setDeleteConfirm({ id: studentId, name: studentName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    
    setDeleting(deleteConfirm.id);
    try {
      await onDeleteStudent(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting student:', error);
      // You might want to show an error message to the user here
    } finally {
      setDeleting(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-3">
      {students.map(student => {
        const studentData = student.basicData || student;
        const isDeleting = deleting === student.id;
        
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
            
            <div className="flex gap-2">
              <button
                onClick={() => onEditStudent(student.id)}
                disabled={isDeleting}
                className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-sm whitespace-nowrap flex items-center gap-1 disabled:opacity-50"
              >
                <Edit size={16} />
                تعديل
              </button>
              
              <button
                onClick={() => handleDeleteClick(student.id, studentData.name)}
                disabled={isDeleting}
                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm whitespace-nowrap flex items-center gap-1 disabled:opacity-50"
              >
                {isDeleting ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <Trash2 size={16} />
                )}
                {isDeleting ? 'جاري الحذف...' : 'حذف'}
              </button>
            </div>
          </div>
        );
      })}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              تأكيد حذف الطالب
            </h3>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من حذف الطالب "{deleteConfirm.name || 'بدون اسم'}"؟
              <br />
              <span className="text-red-600 font-medium">هذا الإجراء لا يمكن التراجع عنه.</span>
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                حذف نهائياً
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList