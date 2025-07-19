
import Navigation from './assets/component/Navigation';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useState } from 'react';
import { db } from './services/firebaseConfig';
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import Header from './assets/component/Header';
import { CoursesPage, SchedulePage, ReportsPage, Contact, SettingsPage } from './assets/component/Placeholder ';
import GradeSection from './assets/assistantComp/students/Students'
import StudentList from './assets/assistantComp/students/studensForms/TempStudent';
import BasicDataForm from './assets/assistantComp/students/StudentForm';
import Staff, { StaffSection } from './assets/assistantComp/staff/Staff';
import DashboardContent from './assets/component/Dashboard';
import AddOrEditStudent from './assets/assistantComp/students/studensForms/AddOrEditStudent';
import InventoryManagement from './assets/assistantComp/Inventory/Inventory';
import { InventoryProvider } from './assets/assistantComp/Inventory/Context/InventoryContext';


function SchoolApp() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);


  const handleSave = async (studentData) => {
    if (studentData.id) {
      const ref = doc(db, "students", studentData.id);
      const { ...rest } = studentData;
      await updateDoc(ref, rest);
    } else {
      await addDoc(collection(db, "students"), studentData);
    }
    setEditingStudent(null);
    window.location.href = "/students/list";
  }

  return (
    <Router>

      <Navigation isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <div className="ltr:lg:ml-64 rtl:lg:mr-64">
        <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <main className="min-h-screen bg-gray-50 p-4">
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="/students" element={<GradeSection />}>
              {/* <Route index element={<Navigate to="" />} /> */}
              <Route
                path="list"
                element={<StudentList onEdit={setEditingStudent} />}
              />

              <Route
                path="edit"
                element={
                  <AddOrEditStudent
                    existingData={editingStudent}
                    onSave={handleSave}
                    onCancel={() => window.history.back()}
                  />
                }
              />
            </Route>
            <Route path="/staff" element={<Staff />}>
              <Route index element={<StaffSection />} />
              <Route path=":section" element={<StaffSection />} />
              <Route path=":section/:staffId" element={<StaffSection />} />
            </Route>
            <Route path="/schedule" element={<SchedulePage />} />
            <Route
              path="/inventory"
              element={
                <InventoryProvider>
                  <InventoryManagement />
                </InventoryProvider>
              }
            />
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