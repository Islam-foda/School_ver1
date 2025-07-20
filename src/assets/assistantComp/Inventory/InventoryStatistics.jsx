import { useInventory } from './Context/useInventory';
import {
  Monitor,
  FlaskConical,
  Armchair,
  FileText,
  TrendingDown,
  Calendar,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const InventoryStatistics = () => {
  const { inventoryData, totalItems, loading } = useInventory();

  const categories = [
    { key: 'اجهزة الكترونية', icon: Monitor, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { key: 'معامل', icon: FlaskConical, color: 'text-green-600', bgColor: 'bg-green-50' },
    { key: 'أثاث', icon: Armchair, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { key: 'أوراق وسجلات', icon: FileText, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { key: 'استهلاك', icon: TrendingDown, color: 'text-red-600', bgColor: 'bg-red-50' },
    { key: 'انئطة', icon: Calendar, color: 'text-indigo-600', bgColor: 'bg-indigo-50' }
  ];

  const calculateCategoryStats = () => {
    return categories.map(category => {
      const items = inventoryData[category.key] || [];
      const totalQuantity = items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
      const totalValue = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

      return {
        ...category,
        count: items.length,
        totalQuantity,
        totalValue,
        percentage: totalItems > 0 ? ((items.length / totalItems) * 100).toFixed(1) : 0
      };
    });
  };

  const calculateOverallStats = () => {
    const allItems = Object.values(inventoryData).flat();
    const totalQuantity = allItems.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
    const totalValue = allItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    const newItems = allItems.filter(item => item.condition === 'new').length;
    const poorItems = allItems.filter(item => item.condition === 'poor').length;

    return {
      totalQuantity,
      totalValue,
      newItems,
      poorItems,
      averageValue: totalItems > 0 ? (totalValue / totalItems).toFixed(2) : 0
    };
  };

  const categoryStats = calculateCategoryStats();
  const overallStats = calculateOverallStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">جاري تحميل الإحصائيات...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي العناصر</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الكمية</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.totalQuantity}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي القيمة</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.totalValue.toFixed(2)} جنيه</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">متوسط القيمة</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.averageValue} جنيه</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">توزيع العناصر حسب الفئة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryStats.map((category) => {
            const IconComponent = category.icon;
            return (
              <div key={category.key} className={`${category.bgColor} rounded-lg p-4 border border-gray-200`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <IconComponent className={`w-6 h-6 ${category.color}`} />
                    <div>
                      <h4 className="font-medium text-gray-800 mr-2">{category.key}</h4>
                      <p className="text-sm text-gray-500 mr-2">{category.count} عنصر</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">{category.percentage}%</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>الكمية: {category.totalQuantity}</p>
                  <p>القيمة: {category.totalValue.toFixed(2)} جنيه</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Condition Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">تحليل حالة العناصر</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800">عناصر جديدة</span>
              </div>
              <span className="font-bold text-green-800">{overallStats.newItems}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-red-800">عناصر بحاجة صيانة</span>
              </div>
              <span className="font-bold text-red-800">{overallStats.poorItems}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">ملخص سريع</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">إجمالي العناصر:</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">إجمالي الكمية:</span>
              <span className="font-medium">{overallStats.totalQuantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">إجمالي القيمة:</span>
              <span className="font-medium">{overallStats.totalValue.toFixed(2)} جنيه</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">متوسط القيمة:</span>
              <span className="font-medium">{overallStats.averageValue} جنيه</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryStatistics; 