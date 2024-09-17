import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthRoute from "./Components/Auth/AuthRoute";
import AddCategory from "./Components/Category/AddCategory";
import CategoriesList from "./Components/Category/CategoriesList";
import UpdateCategory from "./Components/Category/UpdateCategory";
import HeroSection from "./Components/Home/Home/HomePage";
import PrivateNavbar from "./Components/Navbar/PrivateNavbar";
import PublicNavbar from "./Components/Navbar/PublicNavbar";
import TransactionForm from "./Components/Transactions/TransactionForm";
import UpdateTransaction from "./Components/Transactions/UpdateTransaction";
import Dashboard from "./Components/Users/Dashboard";
import LoginForm from "./Components/Users/Login";
import RegistrationForm from "./Components/Users/Register";
import UserProfile from "./Components/Users/UserProfile";
import { getUserFromStorage } from "./utils/getUserFromStorage";
AuthRoute;
function App() {
  const token = getUserFromStorage();
  const user = useSelector((state) => state?.auth?.user);

  return (
    <>
      <BrowserRouter>
        {/*Navbar */}

        {user ? <PrivateNavbar /> : <PublicNavbar />}
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route
            path="/add-category"
            element={
              <AuthRoute>
                <AddCategory />
              </AuthRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <AuthRoute>
                <CategoriesList />
              </AuthRoute>
            }
          />
          <Route
            path="/update-category/:id"
            element={
              <AuthRoute>
                <UpdateCategory />
              </AuthRoute>
            }
          />
          <Route
            path="/add-transaction"
            element={
              <AuthRoute>
                <TransactionForm />
              </AuthRoute>
            }
          />
          <Route
            path="/update-transaction/:id"
            element={
              <AuthRoute>
                <UpdateTransaction />
              </AuthRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthRoute>
                <Dashboard />
              </AuthRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthRoute>
                <UserProfile />
              </AuthRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
