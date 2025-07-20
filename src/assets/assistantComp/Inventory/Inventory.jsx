import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InventoryProvider } from './Context/InventoryContext';
import InventoryCategory from './InvnetoryCategory';
import AddItemForm from './AddItemForm';
import EditItemForm from './EditItemForm';
import InventoryStatistics from './InventoryStatistics';
import InventorySettings from './InventorySettings';
import {
  Monitor,
  FlaskConical,
  Armchair,
  FileText,
  TrendingDown,
  Calendar,
  Plus,
  List,
  BarChart3,
  Settings,
  ArrowLeft,
  Edit
} from 'lucide-react';



const InventoryManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('list');
  const [showIconMenu, setShowIconMenu] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  const handleMenuItemClick = (key) => {
    setActiveTab(key);
    setShowIconMenu(false);
    setEditingItem(null); // Clear editing item when switching tabs
  };

  const handleBackToMenu = () => {
    setActiveTab(null);
    setShowIconMenu(true);
    setEditingItem(null); // Clear editing item when going back
    navigate('/inventory');
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setActiveTab('edit');
    setShowIconMenu(false);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setActiveTab('list');
  };

  const handleSaveEdit = () => {
    setEditingItem(null);
    setActiveTab('list');
    // Optionally show success message
    console.log('Item updated successfully');
  };

  const menuItems = [
    {
      key: 'list',
      title: 'قائمة المخزون',
      titleAr: 'Inventory List',
      icon: List,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
    },
    {
      key: 'add',
      title: 'إضافة عنصر جديد',
      titleAr: 'Add New Item',
      icon: Plus,
      color: 'bg-green-100 text-green-600 hover:bg-green-200'
    },
    {
      key: 'edit',
      title: 'تعديل العناصر',
      titleAr: 'Edit Items',
      icon: Edit,
      color: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
      disabled: true // This will be enabled when items are selected
    },
    {
      key: 'statistics',
      title: 'إحصائيات المخزون',
      titleAr: 'Inventory Statistics',
      icon: BarChart3,
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200'
    },
    {
      key: 'settings',
      title: 'إعدادات المخزون',
      titleAr: 'Inventory Settings',
      icon: Settings,
      color: 'bg-orange-100 text-orange-600 hover:bg-orange-200'
    }
  ];

  const categories = [
    {
      category: 'electronics',
      title: 'Electronic Devices',
      titleAr: 'أجهزة الكترونية',
      icon: Monitor,
      color: 'border-blue-500'
    },
    {
      category: 'labs',
      title: 'Laboratory Equipment',
      titleAr: 'معامل',
      icon: FlaskConical,
      color: 'border-green-500'
    },
    {
      category: 'furniture',
      title: 'Furniture',
      titleAr: 'اثاث',
      icon: Armchair,
      color: 'border-purple-500'
    },
    {
      category: 'documents',
      title: 'Documents & Records',
      titleAr: 'اوراق وسجلات',
      icon: FileText,
      color: 'border-yellow-500'
    },
    {
      category: 'consumables',
      title: 'Consumables',
      titleAr: 'استهلاك',
      icon: TrendingDown,
      color: 'border-red-500'
    },
    {
      category: 'activities',
      title: 'Activities',
      titleAr: 'انشطة',
      icon: Calendar,
      color: 'border-indigo-500'
    }
  ];

  const forms = {
    list: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map((categoryConfig) => (
            <InventoryCategory
              key={categoryConfig.category}
              {...categoryConfig}
              onEditItem={handleEditItem}
            />
          ))}
        </div>
      </div>
    ),
    add: (
      <AddItemForm
        onSave={() => {
          // Optionally refresh data or show success message
          console.log('Item added successfully');
        }}
        onCancel={() => setActiveTab('list')}
      />
    ),
    edit: (
      <EditItemForm
        item={editingItem}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    ),
    statistics: <InventoryStatistics />,
    settings: <InventorySettings />
  };

  const getFormName = (key) => {
    const item = menuItems.find(item => item.key === key);
    return item ? item.title : key;
  };

  return (
    <InventoryProvider>
      <div>
        <div className="bg-blue-600 p-6 text-white mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">إدارة مخزون المدرسة</h2>
          </div>
          {!showIconMenu && (
            <button
              onClick={handleBackToMenu}
              className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded text-sm flex items-center space-x-2 rtl:space-x-reverse"
            >
              <span>العودة للقائمة الرئيسية</span>
              <ArrowLeft size={16} />
            </button>
          )}
        </div>

        {showIconMenu ? (
          // Icon Menu View
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => !item.disabled && handleMenuItemClick(item.key)}
                    disabled={item.disabled}
                    className={`${item.color} p-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <IconComponent size={48} />
                      <span className="text-sm font-medium text-center leading-tight">
                        {item.title}
                      </span>

                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          // Form View
          <div className="p-4">
            <div className="flex overflow-x-auto mb-4">
              {Object.keys(forms).map(key => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2 mx-1 rounded-t-lg whitespace-nowrap ${activeTab === key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'
                    }`}
                >
                  {getFormName(key)}
                </button>
              ))}
            </div>

            <div className="border rounded-lg p-4">
              {forms[activeTab]}
            </div>
          </div>
        )}
      </div>
    </InventoryProvider>
  );
};

export default InventoryManagement;