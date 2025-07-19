import { useState } from 'react';
import {
  Settings,
  Save,
  Database,
  Bell,
  Shield,
  Download,
  Upload,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { collection, setDoc, doc } from 'firebase/firestore';
  import { db } from '../../../services/firebaseConfig';


const InventorySettings = () => {
  const [settings, setSettings] = useState({
    lowStockThreshold: 5,
    enableNotifications: true,
    autoBackup: true,
    backupFrequency: 'weekly',
    currency: 'EGP',
    language: 'ar',
    requireApproval: false,
    maxItemsPerPage: 20
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // implement  Save settings to Firebase
      const settingsRef = collection(db, 'inventorySettings');
      await setDoc(doc(settingsRef, 'settings'), settings);
      console.log('Settings saved:', settings);

      // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      // console.log('Settings saved:', settings);
      alert('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    // TODO: Implement data export functionality
    alert('سيتم تنفيذ تصدير البيانات قريباً');
  };

  const handleImportData = () => {
    // TODO: Implement data import functionality
    alert('سيتم تنفيذ استيراد البيانات قريباً');
  };

  const handleClearData = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع بيانات المخزون؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      // TODO: Implement data clearing functionality
      alert('سيتم تنفيذ حذف البيانات قريباً');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* General Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <Settings className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">الإعدادات العامة</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حد المخزون المنخفض
            </label>
            <input
              type="number"
              value={settings.lowStockThreshold}
              onChange={(e) => handleSettingChange('lowStockThreshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
            <p className="text-xs text-gray-500 mt-1">سيتم إرسال تنبيه عند انخفاض الكمية عن هذا الحد</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العملة
            </label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="EGP">جنيه مصري (EGP)</option>
              <option value="USD">دولار أمريكي (USD)</option>
              <option value="EUR">يورو (EUR)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عدد العناصر في الصفحة
            </label>
            <select dir='ltr' 
              value={settings.maxItemsPerPage}
              onChange={(e) => handleSettingChange('maxItemsPerPage', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10 عناصر</option>
              <option value={20}>20 عنصر</option>
              <option value={50}>50 عنصر</option>
              <option value={100}>100 عنصر</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اللغة
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <Bell className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-800">إعدادات الإشعارات</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">تفعيل الإشعارات</h3>
              <p className="text-sm text-gray-500">استلام إشعارات عند انخفاض المخزون</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">النسخ الاحتياطي التلقائي</h3>
              <p className="text-sm text-gray-500">إنشاء نسخة احتياطية تلقائية للبيانات</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {settings.autoBackup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تكرار النسخ الاحتياطي
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">يومياً</option>
                <option value="weekly">أسبوعياً</option>
                <option value="monthly">شهرياً</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <Shield className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-800">إعدادات الأمان</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">الموافقة على التعديلات</h3>
            <p className="text-sm text-gray-500">تطلب موافقة المدير على تعديل أو حذف العناصر</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.requireApproval}
              onChange={(e) => handleSettingChange('requireApproval', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <Database className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-semibold text-gray-800">إدارة البيانات</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center space-x-2 rtl:space-x-reverse p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5 text-blue-600" />
            <span>تصدير البيانات</span>
          </button>

          <button
            onClick={handleImportData}
            className="flex items-center justify-center space-x-2 rtl:space-x-reverse p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-5 h-5 text-green-600" />
            <span>استيراد البيانات</span>
          </button>

          <button
            onClick={handleClearData}
            className="flex items-center justify-center space-x-2 rtl:space-x-reverse p-4 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-red-600"
          >
            <Trash2 className="w-5 h-5" />
            <span>حذف جميع البيانات</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>حفظ الإعدادات</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InventorySettings; 