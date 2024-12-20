import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Authentication from "./components/Authentication/Authentication.js";
import CheckoutForm from "./components/CheckoutForm/CheckoutForm.js";
// import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ProtectedRoute from "./components/ProtectedRoute.js";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/reducers/user.js";
import { useEffect, useState } from "react";
import Header from "./components/Header/Header.js";
import Home from "./components/Home/Home.js";
import SuccessOnboardingStripe from "./components/SuccessOnboardingStripe/SuccessOnboardingStripe.js";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

const App = () => {
  const dispatch = useDispatch();

  //@ts-ignore

  const { user } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);

  console.log(user, "Containerization");
  const getUser = async () => {
    try {
      const res = await axios.get("/user/me");
      console.log(res, "I'm response,  hey I'm response");
      dispatch(setUser(res.data.user));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // dispatch(setUser(null));
    }
  };

  useEffect(() => {
    getUser();
  }, [dispatch]);

  return (
    !loading && (
      <Router>
        {!!user && <Header />}
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isLoading={loading} isAuthenticated={user}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute isLoading={loading} isAuthenticated={user}>
                <CheckoutForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/auth"
            element={
              <ProtectedRoute
                isLoading={loading}
                redirect="/"
                isAuthenticated={!user}
              >
                {" "}
                <Authentication />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/stripe/success"
            element={
              <ProtectedRoute isLoading={loading} isAuthenticated={user}>
                {" "}
                <SuccessOnboardingStripe />{" "}
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </Router>
    )
  );
};

export default App;
