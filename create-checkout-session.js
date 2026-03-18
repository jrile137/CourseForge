const Stripe = require('stripe');

module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate env var is set
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Build the absolute base URL from request headers
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host     = req.headers['x-forwarded-host'] || req.headers.host;
  const baseUrl  = `${protocol}://${host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'CourseForge — Complete eCommerce Course Guide',
              description: '9 modules · 24 tools · 6 case studies · Lifetime access',
              images: [], // Optional: add a product image URL here
            },
            unit_amount: 500, // $5.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Stripe appends ?session_id={CHECKOUT_SESSION_ID} automatically
      success_url: `${baseUrl}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/?cancelled=true`,
      // Optional: collect billing email
      billing_address_collection: 'auto',
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
