import React from "react";
import { Settings } from "lucide-react";

const SettingsPage = () => (
  <div className="p-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        الاعدادات
      </h2>
      <p className="text-gray-600">
        إدارة تفضيلات النظام وأذونات المستخدم ومعلومات المدرسة.
      </p>
    </div>
  </div>
);

export default {
  SettingsPage,
};
export {
  SettingsPage,
};
