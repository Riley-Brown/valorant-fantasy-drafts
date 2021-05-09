import { Router } from 'express';
const router = Router();

import Stripe from 'stripe';

import { getUsersCollection } from '../../DB/users';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.get('/get-payment', async (req, res) => {
  const { usersCollection, mongoClient } = await getUsersCollection();

  const { id: userId } = res.locals.userTokenObject;
  console.log(userId);

  try {
    const userAccount = await usersCollection.findOne({ _id: userId });

    const stripeCustomer = await stripe.customers.retrieve(
      userAccount.stripeCustomerId
    );

    res.json(stripeCustomer);
  } catch (err) {
    console.log(err);
  }
});

router.post('/charge', async (req, res) => {
  const { chargeAmount } = req.body;

  const { usersCollection, mongoClient } = await getUsersCollection();

  const { id: userId } = res.locals.userTokenObject;

  try {
    const userAccount = await usersCollection.findOne({ _id: userId });

    if (!userAccount.stripeCustomerId) {
      return res
        .status(400)
        .json({ type: 'error', message: 'No payment has been added yet' });
    }

    const stripeCustomer = await stripe.customers.retrieve(
      userAccount.stripeCustomerId
    );

    const charge = await stripe.charges.create({
      amount: chargeAmount,
      currency: 'usd',
      customer: stripeCustomer.id,
      receipt_email: userAccount.email
    });

    const { captured, amount_captured, paid } = charge;

    if (captured && paid) {
      const updateUser = await usersCollection.findOneAndUpdate(
        { _id: userId },
        {
          $inc: { balance: amount_captured }
        },
        // return updated updated document values
        { returnOriginal: false }
      );

      return res.json({
        type: 'success',
        message: `Successfully added $${amount_captured / 100} to balance`,
        data: { balance: updateUser.value.balance }
      });
    } else {
      return res
        .status(400)
        .json({ type: 'error', message: 'Error capturing payment' });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ type: 'error', message: 'Error capturing payment' });
  }
});

router.post('/add-payment', async (req, res) => {
  const { number, exp_month, exp_year, cvc } = req.body;

  console.log(number, exp_month, exp_year, cvc);

  if (!number || !exp_month || !exp_year || !cvc) {
    return res.status(400).json({
      type: 'error',
      message: 'Missing required payment params'
    });
  }

  const { usersCollection, mongoClient } = await getUsersCollection();

  const { id: userId } = res.locals.userTokenObject;

  try {
    const userAccount = await usersCollection.findOne({ _id: userId });

    if (!userAccount.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userAccount.email
      });

      const token = await stripe.tokens.create({
        card: {
          number,
          exp_month,
          exp_year,
          cvc
        }
      });

      const createSource = await stripe.customers.createSource(customer.id, {
        source: token.id
      });

      console.log({ createSource, token });

      await usersCollection.findOneAndUpdate(
        { _id: userId },
        { $set: { stripeCustomerId: customer.id } }
      );

      return res.json({
        type: 'success',
        message: 'Stripe payment successfully added',
        data: {
          cardBrand: token.card.brand,
          cardLast4: token.card.last4,
          stripeCustomerId: customer.id
        }
      });
    } else {
      const customer = await stripe.customers.retrieve(
        userAccount.stripeCustomerId
      );

      const newToken = await stripe.tokens.create({
        card: {
          number,
          exp_month,
          exp_year,
          cvc
        }
      });

      console.log({ newToken });

      await stripe.customers.update(customer.id, {
        source: newToken.id
      });

      res.json({
        type: 'success',
        message: 'Stripe payment successfully updated',
        data: {
          cardBrand: newToken.card.brand,
          cardLast4: newToken.card.last4,
          stripeCustomerId: customer.id
        }
      });
    }
  } catch (err) {
    console.log(err);

    if (err.raw) {
      res.status(400).json({ type: err.raw.type, message: err.raw.message });
    } else {
      res
        .status(400)
        .json({ type: 'error', message: 'Error adding payment method' });
    }
  }
});

export default router;
