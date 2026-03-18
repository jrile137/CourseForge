const Stripe = require('stripe');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const { sessionId } = req.body;

  if (!sessionId || typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
    return res.status(400).json({ error: 'Invalid session ID' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Payment confirmed — return success
      return res.status(200).json({
        paid: true,
        email: session.customer_details?.email || null,
      });
    } else {
      return res.status(200).json({ paid: false });
    }

  } catch (err) {
    console.error('Stripe verify error:', err.message);
    return res.status(500).json({ error: 'Could not verify payment' });
  }
};
