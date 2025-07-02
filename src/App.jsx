
import Navigation from './assets/component/Navigation';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import React, { useState } from 'react';
import Header from './assets/component/Header';
import { CoursesPage, SchedulePage, ReportsPage, Contact, SettingsPage } from './assets/component/Placeholder ';
import Students, { GradeSection } from './assets/assistantComp/students/Students';
import Staff, { StaffSection } from './assets/assistantComp/staff/Staff';
import DashboardContent from './assets/component/Dashboard';

function SchoolApp() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <Router>

      <Navigation isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <div className="ltr:lg:ml-64 rtl:lg:mr-64">
        <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <main className="min-h-screen bg-gray-50 p-4">
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="/students" element={<Students />}>
              <Route index element={
                <div className="p-4 text-gray-500 text-center">
                  اختر صفًا لعرض بياناته
                </div>
              } />
              <Route path=":grade" element={<GradeSection />}>
                <Route path=":studentId" element={<GradeSection />} />
              </Route>
            </Route>
            <Route path="/staff" element={<Staff />}>
              <Route index element={<StaffSection />} />
              <Route path=":section" element={<StaffSection />} />
              <Route path=":section/:staffId" element={<StaffSection />} />
            </Route>
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/inventory" element={<ReportsPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Optional: Redirect for unmatched paths */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold text-gray-700">404</h1>
                <p className="text-lg text-gray-500">الصفحة غير موجودة</p>
                <Link
                  to="/"
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  العودة للصفحة الرئيسية
                </Link>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default SchoolApp