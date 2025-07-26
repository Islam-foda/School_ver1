import React, { useState } from 'react';
import { Trash2, Edit, User, IdCard, Phone, Mail } from 'lucide-react';
import PermissionGuard from '../../../components/PermissionGuard';

const StaffList = ({ staff, loading, onEditStaff, onDeleteStaff }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(null);
  if (loading) return <div className="p-4 text-center">جاري تحميل بيانات الموظفين...</div>;
  if (!staff?.length) return <div className="p-4 text-center text-gray-500">لا يوجد موظفين مسجلين</div>;

  const handleDeleteClick = (staffId, staffName) => {
    setDeleteConfirm({ id: staffId, name: staffName });
  };



  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(deleteConfirm.id);
    try {
      await onDeleteStaff(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting staff member:', error);
    } finally {
      setDeleting(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-3">
      {staff.map(member => {
        const staffData = member.basicData || member;
        const isDeleting = deleting === member.id;

        return (
          <div key={member.id} className="p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <User size={20} className="text-gray-600" />
                  <h3 className="font-medium text-gray-800">
                    {staffData.name || 'بدون اسم'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                  {staffData.staffId && (
                    <div className="flex items-center gap-2">
                      <IdCard size={16} />
                      <span>رقم الموظف: {staffData.staffId}</span>
                    </div>
                  )}
                  {staffData.nationalId && (
                    <div className="flex items-center gap-2">
                      <IdCard size={16} />
                      <span>الرقم القومي: {staffData.nationalId}</span>
                    </div>
                  )}
                  {staffData.position && (
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>الوظيفة: {staffData.position}</span>
                    </div>
                  )}
                  {staffData.department && (
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>القسم: {staffData.department}</span>
                    </div>
                  )}
                  {staffData.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      <span>الهاتف: {staffData.phone}</span>
                    </div>
                  )}
                  {staffData.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span>البريد: {staffData.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <div className="flex gap-2">
                  <PermissionGuard permission="edit-staff">
                    <button
                      onClick={() => onEditStaff(member.id)}
                      disabled={isDeleting}
                      className="px-3 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 text-sm whitespace-nowrap flex items-center gap-1 disabled:opacity-50"
                    >
                      <Edit size={16} />
                      تعديل
                    </button>
                  </PermissionGuard>
                  <PermissionGuard permission="delete-staff">
                    <button
                      onClick={() => handleDeleteClick(member.id, staffData.name)}
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
                  </PermissionGuard>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              تأكيد حذف الموظف
            </h3>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من حذف الموظف "{deleteConfirm.name || 'بدون اسم'}"؟
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

export default StaffList;