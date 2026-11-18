
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import {
  PublicLayout,
  PrivateLayout
} from './components/Layout';

import {
  RequireAuth,
  RequireRole
} from './routes/Guards';

import PublicHome from './pages/PublicHome';
import Login from './pages/Login';
import Students from './pages/Students';
import Users from './pages/Users';
import Attendance from './pages/Attendance';
import MaterialsChecking from './pages/MaterialsChecking';

import {
  AdminDashboard,
  AnimationDashboard,
  SecretaryDashboard
} from './pages/Dashboards';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route element={<PublicLayout />}>
            <Route path="/" element={<PublicHome />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route element={<PrivateLayout />}>

              <Route element={<RequireRole roles={['admin']} />}>
                <Route
                  path="/admin/dashboard"
                  element={<AdminDashboard />}
                />

                <Route
                  path="/admin/students"
                  element={<Students />}
                />

                <Route
                  path="/admin/users"
                  element={<Users />}
                />
              </Route>

              <Route element={<RequireRole roles={['animation']} />}>
                <Route
                  path="/animation/dashboard"
                  element={<AnimationDashboard />}
                />

                <Route
                  path="/animation/attendance"
                  element={<Attendance />}
                />

                <Route
                  path="/animation/materials-checking"
                  element={<MaterialsChecking />}
                />
              </Route>

              <Route element={<RequireRole roles={['secretary']} />}>
                <Route
                  path="/secretary/dashboard"
                  element={<SecretaryDashboard />}
                />

                <Route
                  path="/secretary/students"
                  element={<Students />}
                />
              </Route>

            </Route>
          </Route>

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
