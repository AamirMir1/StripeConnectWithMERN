import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
  "pk_test_51N5ONLInrFgshWwTyCnrrDtiRh2QGExBrxK37Wdl8SvTDt0busOniqXev06sY7Dh5TDVMgVOUkjMvLobAwVCS1nd00RfWfsaNA"
);

const CheckOutForm = (props: any) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    setIsProcessing(true);

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      return toast.error(error.message || "Something Went Wrong");
    }

    if (paymentIntent.status === "succeeded") {
      try {
        const res = await axios.post(`/stripe/payoutToSellers`, {
          cartItems: props?.cartItems,
          paymentIntentId: props?.paymentIntentId,
        });

        toast.success(res.data.message);
      } catch (error) {
        toast.error(`Failed to paid out`);
      }
    }
    setIsProcessing(false);
  };
  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : `Pay ${props?.amount}`}
        </button>
      </form>
    </div>
  );
};

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState(null);
  const [cartItems, setCartItems] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [amount, setAmount] = useState(0);

  const getClientSecret = async () => {
    try {
      //@ts-ignore
      const res = await axios.post("/stripe/process/payment");

      setClientSecret(res.data.client_secret);
      setCartItems(res.data.cartItems);
      setPaymentIntentId(res.data.paymentIntentId);
      setAmount(res.data.amount);
    } catch (error) {
      //@ts-ignore
      toast.error(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    getClientSecret();
  }, []);

  if (!clientSecret) return;

  return (
    <Elements
      options={{
        clientSecret,
      }}
      stripe={stripePromise}
    >
      <CheckOutForm
        cartItems={cartItems}
        paymentIntentId={paymentIntentId}
        amount={amount}
      />
    </Elements>
  );
};

export default Checkout;
