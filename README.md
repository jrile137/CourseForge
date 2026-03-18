# CourseForge — Deployment Guide

Complete eCommerce course guide with Stripe $5 paywall.
Deploy to Vercel in ~10 minutes.

---

## Project Structure

```
courseforge/
├── api/
│   ├── create-checkout-session.js  ← Creates Stripe checkout
│   └── verify-session.js           ← Confirms payment on return
├── public/
│   └── index.html                  ← Your full website
├── .env.example                    ← Copy to .env.local for local dev
├── package.json
├── vercel.json
└── README.md
```

---

## Step 1 — Get your Stripe keys

1. Go to https://dashboard.stripe.com and sign in (or create a free account)
2. Navigate to **Developers → API Keys**
3. Copy your **Secret key** — it starts with `sk_test_...` for test mode
4. Keep this safe — never share it or commit it to Git

---

## Step 2 — Deploy to Vercel

### Option A: Vercel CLI (fastest)

```bash
# Install Vercel CLI
npm install -g vercel

# Inside the project folder
cd courseforge
vercel

# Follow the prompts:
# - Link to existing project? → No
# - Project name → courseforge (or anything you like)
# - Which directory is your code? → ./
# - Override settings? → No
```

### Option B: Vercel Dashboard (no CLI)

1. Push this folder to a GitHub repository
2. Go to https://vercel.com → **Add New Project**
3. Import your GitHub repository
4. Click **Deploy** — Vercel auto-detects the config

---

## Step 3 — Add your Stripe secret key

**In Vercel Dashboard:**
1. Go to your project → **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `STRIPE_SECRET_KEY`
   - **Value:** `sk_test_xxxxxxxxxxxxxxxxxxxx`  ← your Stripe secret key
   - **Environment:** Production, Preview, Development (check all three)
3. Click **Save**
4. Go to **Deployments** → click the three dots on your latest deploy → **Redeploy**

---

## Step 4 — Test the payment flow

Use Stripe's test card details (no real money):

| Field       | Value                  |
|-------------|------------------------|
| Card number | `4242 4242 4242 4242`  |
| Expiry      | Any future date        |
| CVC         | Any 3 digits           |
| Name        | Any name               |

1. Visit your Vercel URL
2. Click **"Get Instant Access — $5"**
3. Complete checkout with the test card above
4. Confirm you're redirected back and the guide unlocks ✓

---

## Step 5 — Go live

When you're ready to accept real payments:

1. Complete Stripe's identity verification in your dashboard
2. Go to **Developers → API Keys** and toggle off **Test mode**
3. Copy your **live** secret key (`sk_live_...`)
4. In Vercel, update `STRIPE_SECRET_KEY` to your live key
5. Redeploy

That's it — you're live and taking real payments.

---

## How the payment flow works

```
User clicks "Get Instant Access"
        ↓
POST /api/create-checkout-session
        ↓
Stripe creates a hosted checkout page
        ↓
User completes payment on Stripe's servers
        ↓
Stripe redirects to /?session_id=cs_xxx
        ↓
POST /api/verify-session (confirms payment is real)
        ↓
Guide unlocks + success modal shown ✓
```

The `verify-session` step is important — it prevents anyone from manually
typing `?session_id=fake` in the URL to bypass payment.

---

## Customisation

**Change the price:**
In `api/create-checkout-session.js`, update `unit_amount`:
```js
unit_amount: 500,  // 500 = $5.00 (always in cents)
unit_amount: 1997, // 1997 = $19.97
unit_amount: 4900, // 4900 = $49.00
```

**Change the product name:**
```js
product_data: {
  name: 'Your Course Name Here',
  description: 'Your description here',
}
```

**Change the currency:**
```js
currency: 'usd',  // or 'gbp', 'eur', 'aud', etc.
```

---

## Local development

```bash
# Install dependencies
npm install

# Create your local env file
cp .env.example .env.local
# Edit .env.local and add your sk_test_... key

# Run locally with Vercel dev server
npx vercel dev
# → Site runs at http://localhost:3000
```

---

## Support

- Stripe docs: https://stripe.com/docs/checkout/quickstart
- Vercel docs: https://vercel.com/docs
- Stripe test cards: https://stripe.com/docs/testing#cards
