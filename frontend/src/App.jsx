import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider, UserData } from "./context/UserContext";
import { PinProvider } from "./context/PinContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Loading } from "./components/Loading";
import Navbar from "./components/Navbar";
import PinPage from "./pages/PinPage";
import Create from "./pages/Create";
import Account from "./pages/Account";
import UserProfile from "./pages/UserProfile";
import SearchPage from "./pages/SearchPage";
import SavePins from "./components/SavePins";

const AppContent = () => {
  const { loading: userLoading } = UserData();

  return (
    <>
      {userLoading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/search/results" element={<SearchPage />} />
            <Route path="/saved" element={<SavePins />} />
            <Route path="/account" element={<Account />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/create" element={<Create />} />
            <Route path="/pin/:id" element={<PinPage />} />
          </Routes>
        </>
      )}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <PinProvider>
          {" "}
          {/* ✅ PinProvider WRAPPED HERE */}
          <AppContent />
        </PinProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
