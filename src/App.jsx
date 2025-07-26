
import Navigation from './assets/component/Navigation';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useState } from 'react';
import { db } from './services/firebaseConfig';
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import Header from './assets/component/Header';
import { SettingsPage } from './assets/component/Placeholder ';
import Contact from './assets/component/Contact';
// students
import GradeSection from './assets/assistantComp/students/Students'
import StudentList from './assets/assistantComp/students/studensForms/TempStudent';
import AddOrEditStudent from './assets/assistantComp/students/studensForms/AddOrEditStudent';
//Staff
import Staff, { StaffSection } from './assets/assistantComp/staff/Staff';
import DashboardContent from './assets/component/Dashboard';
import InventoryManagement from './assets/assistantComp/Inventory/Inventory';
import { InventoryProvider } from './assets/assistantComp/Inventory/Context/InventoryContext';
import SchedulePage from './assets/assistantComp/Schedule/SchedulePage';
// Auth
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import SetupUsers from './components/SetupUsers';


function SchoolApp() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const handleSave = async (studentData) => {
    if (studentData.id) {
      const ref = doc(db, "students", studentData.id);
      const { ...rest } = studentData;
      await updateDoc(ref, rest);
    } else {
      await addDoc(collection(db, "students"), studentData);
    }
    window.location.href = "/students/list";
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/*" element={
            <ProtectedRoute>
              <>
                <Navigation isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                <div className="ltr:lg:ml-64 rtl:lg:mr-64">
                  <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
                  <main className="min-h-screen bg-gray-50 p-4">
                    <Routes>
                      <Route path="/" element={<DashboardContent />} />
                      <Route path="/dashboard" element={<DashboardContent />} />

                      <Route path="/students" element={
                        <ProtectedRoute requiredPermission="view-students">
                          <GradeSection />
                        </ProtectedRoute>
                      }>
                        <Route
                          path="list"
                          element={<StudentList />}
                        />
                        <Route
                          path="edit/:id"
                          element={
                            <ProtectedRoute requiredPermission="edit-students">
                              <AddOrEditStudent
                                onSave={handleSave}
                                onCancel={() => window.history.back()}
                              />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="edit"
                          element={
                            <ProtectedRoute requiredPermission="edit-students">
                              <AddOrEditStudent
                                onSave={handleSave}
                                onCancel={() => window.history.back()}
                              />
                            </ProtectedRoute>
                          }
                        />
                      </Route>

                      <Route path="/staff" element={
                        <ProtectedRoute requiredPermission="view-staff">
                          <Staff />
                        </ProtectedRoute>
                      }>
                        <Route index element={<StaffSection />} />
                        <Route path=":section" element={<StaffSection />} />
                        <Route path=":section/:staffId" element={<StaffSection />} />
                      </Route>

                      <Route path="/schedule" element={<SchedulePage />} />

                      <Route
                        path="/inventory"
                        element={
                          <ProtectedRoute requiredPermission="view-inventory">
                            <InventoryProvider>
                              <InventoryManagement />
                            </InventoryProvider>
                          </ProtectedRoute>
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
              </>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default SchoolApp