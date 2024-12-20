import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/reducers/user";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:3000";
const SuccessOnboardingStripe = () => {
  //@ts-ignore
  const { user } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const dispatch = useDispatch();
  const updateStripeAccountStatus = async () => {
    try {
      const res = await axios.put("/stripe/checkAndUpdateStatus");
      console.log(res, "Get response");
      dispatch(
        setUser({
          ...user,
          isActiveStripeAccount: res.data.isActiveStripeAccount,
        })
      );
      console.log(res, "Hey");
      setLoading(false);
      if (!res.data.isActiveStripeAccount) {
        setFailed(true);
        console.log(res.data.isActiveStripeAccount, "Prince");
      }
    } catch (error) {
      setLoading(false);
      console.log(error, "Main error");
    }
  };
  useEffect(() => {
    updateStripeAccountStatus();
  }, []);
  return !failed ? (
    <h1>Stripe Account Created Successfully</h1>
  ) : (
    <h1>
      Failed to complete onboarding process. Please make sure that you've
      provided correct information
    </h1>
  );
};

export default SuccessOnboardingStripe;
