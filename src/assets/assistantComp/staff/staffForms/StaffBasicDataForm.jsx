import { db } from '../../../../services/firebaseConfig'; 
 import { User, Briefcase, Save, Phone } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
// import { User, Briefcase, Phone, Save } from 'lucide-react';

const StaffBasicDataForm = ({ staffId: propStaffId,onRefresh }) => {
  // Get staffId from props first, then from URL params as fallback
  const { staffId: urlStaffId } = useParams();
  const staffId = propStaffId || urlStaffId;
  
  const [formData, setFormData] = useState({
    staffId: '',
    name: '',
    nationalId: '',
    phone: '',
    email: '',
    address: '',
    position: '',
    department: '',
    hireDate: '',
    salary: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (staffId) {
      fetchStaffData();
    }
  }, [staffId]);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'staff', staffId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Handle both old structure (with basicData) and new flat structure
        const staffData = data.basicData ? data.basicData : data;
        setFormData({
          staffId: staffData.staffId || staffId,
          name: staffData.name || '',
          nationalId: staffData.nationalId || '',
          phone: staffData.phone || '',
          email: staffData.email || '',
          address: staffData.address || '',
          position: staffData.position || '',
          department: staffData.department || '',
          hireDate: staffData.hireDate || '',
          salary: staffData.salary || '',
          emergencyContact: staffData.emergencyContact || '',
          emergencyPhone: staffData.emergencyPhone || ''
        });
      }
    } catch (error) {
      console.error('Error fetching staff data:', error);
      alert('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    onRefresh();

    try {
      // Validate required fields
      if (!formData.staffId.trim()) {
        alert('كود المعلم مطلوب');
        setSaving(false);
        return;
      }

      if (!formData.name.trim()) {
        alert('اسم المعلم مطلوب');
        setSaving(false);
        return;
      }

      // Prepare data for saving
      const staffData = {
        // Store in flat structure for easier access
        ...formData,
        // Also maintain basicData for backward compatibility
        basicData: formData,
        updatedAt: new Date().toISOString()
      };

      if (staffId) {
        // Update existing staff member
        await updateDoc(doc(db, 'staff', staffId), staffData);
        console.log('Staff data updated successfully');
        alert('تم تحديث بيانات المعلم بنجاح');
      } else {
        // Create new staff member using staffId as document ID
        // Check if staff ID already exists
        const existingDoc = await getDoc(doc(db, 'staff', formData.staffId));
        if (existingDoc.exists()) {
          alert('كود المعلم موجود بالفعل، يرجى استخدام كود آخر');
          setSaving(false);
          return;
        }

        await setDoc(doc(db, 'staff', formData.staffId), {
          ...staffData,
          createdAt: new Date().toISOString()
        });
        console.log('New staff member created successfully');
        alert('تم إضافة المعلم الجديد بنجاح');
        
        // Clear form after successful creation
        setFormData({
          staffId: '',
          name: '',
          nationalId: '',
          phone: '',
          email: '',
          address: '',
          position: '',
          department: '',
          hireDate: '',
          salary: '',
          emergencyContact: '',
          emergencyPhone: ''
        });
      }
    } catch (error) {
      console.error('Error saving staff data:', error);
      alert('حدث خطأ أثناء حفظ البيانات: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          {staffId ? 'تعديل بيانات المعلم' : 'إضافة معلم جديد'}
        </h3>
        {staffId && (
          <div className="text-sm text-gray-600">
            كود المعلم: <span className="font-mono font-medium">{staffId}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            المعلومات الأساسية
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كود المعلم *
              </label>
              <input
                type="text"
                name="staffId"
                value={formData.staffId}
                onChange={handleInputChange}
                disabled={!!staffId} // Disable if editing existing staff
                placeholder="أدخل كود المعلم"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
              {staffId && (
                <p className="text-xs text-gray-500 mt-1">
                  لا يمكن تعديل كود المعلم بعد الإنشاء
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="أدخل الاسم الكامل"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الرقم القومي
              </label>
              <input
                type="text"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleInputChange}
                placeholder="أدخل الرقم القومي"
                maxLength="14"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="أدخل رقم الهاتف"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="أدخل البريد الإلكتروني"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="أدخل العنوان"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Job Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            معلومات الوظيفة
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوظيفة
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="أدخل الوظيفة"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                القسم
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="أدخل القسم"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ التعيين
              </label>
              <input
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المرتب
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="أدخل المرتب"
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            بيانات الطوارئ
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                جهة الاتصال في الطوارئ
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                placeholder="أدخل اسم جهة الاتصال"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم هاتف الطوارئ
              </label>
              <input
                type="tel"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleInputChange}
                placeholder="أدخل رقم هاتف الطوارئ"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                حفظ البيانات
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};


// Don't forget to import the icons at the top of your file:

export default StaffBasicDataForm;