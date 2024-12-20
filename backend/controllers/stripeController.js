import { TryCatch } from "../utils/ErrorHandler.js";

import { stripe } from "../app.js";
import { User } from "../models/userModel.js";

const createAccountLink = TryCatch(async (req, res, next) => {
  const userId = req.user._id;

  const account = await stripe.accounts.create({
    type: "express",
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: "http://localhost:5173/stripe/failed",
    return_url: "http://localhost:5173/stripe/success",
    type: "account_onboarding",
  });

  const user = await User.findById(userId);

  user.stripeAccountId = account.id;
  await user.save({ validateBeforeSave: true });

  res.status(201).json({
    success: true,
    url: accountLink.url,
  });
});

const processPayment = TryCatch(async (req, res, next) => {
  const cartItems = [
    {
      price: 3000,
      sellerId: "acct_1QXnK1IKuXwwgYUh",
    },
  ];

  const totalAmount = cartItems.reduce((acc, currentValue) => {
    return acc + currentValue.price;
  }, 0);

  console.log(totalAmount);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalAmount * 100),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
    cartItems,
    paymentIntentId: paymentIntent.id,
    amount: totalAmount,
  });
});

const payoutToSellers = TryCatch(async (req, res, next) => {
  const commission = 0.1; // 10% commission
  const { cartItems, paymentIntentId } = req.body;

  for (let i = 0; i < cartItems.length; i++) {
    const sellerAmount = cartItems[i].price * 100;
    const commissionAmount = Math.round(sellerAmount * commission);

    const amountAfterCommission = sellerAmount - commissionAmount;

    // Pay to each sellers

    await stripe.transfers.create({
      amount: amountAfterCommission,
      currency: "usd",
      destination: cartItems[i].sellerId,
      transfer_group: paymentIntentId,
    });
  }

  res.status(200).json({
    success: true,
    message: "Payment Successfully",
  });
});
const checkAccountStatusAndUpdate = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  const account = await stripe.accounts.retrieve(user.stripeAccountId);

  const status = {
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
    requirements: account.requirements.pending_verification,
  };

  if (status.chargesEnabled && status.payoutsEnabled) {
    user.isActiveStripeAccount = true;
  } else {
    user.isActiveStripeAccount = false;
  }

  await user.save();

  res.status(200).json({
    isActiveStripeAccount: user.isActiveStripeAccount,
    status,
  });
});

export {
  createAccountLink,
  processPayment,
  checkAccountStatusAndUpdate,
  payoutToSellers,
};
