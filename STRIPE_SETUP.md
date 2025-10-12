# Stripe Integration Setup

This document explains how to configure and use the Stripe integration in your Boost SEO project.

## Prerequisites

1. Create a Stripe account at [https://stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard

## Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Site Configuration
SITE_URL=http://localhost:4321
```

### Getting Your Stripe Keys

1. **Secret Key & Publishable Key**:
   - Go to Stripe Dashboard → Developers → API keys
   - Copy the "Secret key" and "Publishable key"
   - Use test keys for development (they start with `sk_test_` and `pk_test_`)

2. **Webhook Secret**:
   - Go to Stripe Dashboard → Developers → Webhooks
   - Create a new webhook endpoint pointing to: `https://boostseo.co.nz/api/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.payment_failed`
   - Copy the webhook secret (starts with `whsec_`)

## Features Included

### 1. Checkout Integration
- ✅ Three pricing plans (1 Day, 3 Days, 1 Week)
- ✅ Brazilian Real (BRL) currency
- ✅ Secure Stripe Checkout pages
- ✅ Loading states and error handling

### 2. Payment Flow
- ✅ Create checkout sessions via API
- ✅ Redirect to Stripe-hosted checkout
- ✅ Success page with next steps
- ✅ Automatic redirect on cancellation

### 3. Webhook Handling
- ✅ Payment confirmation webhook
- ✅ Payment failure handling
- ✅ Metadata tracking (plan name, duration)

## File Structure

```
src/
├── components/
│   ├── StripeCheckout.tsx      # React component for checkout buttons
│   └── Pricing.astro           # Updated with Stripe integration
├── pages/
│   ├── api/
│   │   ├── create-checkout-session.ts  # Creates Stripe checkout sessions
│   │   └── webhook.ts                  # Handles Stripe webhooks
│   └── sucesso.astro           # Success page after payment
└── .env.example                # Environment variables template
```

## Testing

### Test Cards

Use these test card numbers in development:

- **Successful payment**: `4242424242424242`
- **Declined payment**: `4000000000000002`
- **Requires authentication**: `4000002500003155`

### Local Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test the checkout flow:
   - Visit `http://localhost:4321`
   - Click on any pricing plan button
   - Use test card numbers above

3. Test webhooks locally using Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:4321/api/webhook
   ```

## Production Deployment

### 1. Environment Variables
- Replace test keys with live keys (start with `sk_live_` and `pk_live_`)
- Update `SITE_URL` to your production domain (e.g., `SITE_URL=https://boostseo.co.nz`)

### 2. Webhook Configuration
- Update webhook endpoint URL to your production domain (`https://boostseo.co.nz/api/webhook`)
- Ensure webhook secret matches your production environment

### 3. Build and Deploy
```bash
npm run build
```

## Customization

### Adding New Plans
1. Add new pricing card in `Pricing.astro`
2. Include `StripeCheckout` component with appropriate props
3. No backend changes needed - prices are calculated dynamically

### Custom Success Page
- Modify `src/pages/sucesso.astro` to match your branding
- Add custom tracking or analytics

### Additional Webhook Events
- Edit `src/pages/api/webhook.ts` to handle more Stripe events
- Add business logic for subscription management, refunds, etc.

## Security Notes

- ✅ All payments processed securely through Stripe
- ✅ No card details stored on your servers
- ✅ Webhook signature verification included
- ✅ Server-side price validation

## Support

For Stripe-related issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

For integration issues, check the browser console and server logs for detailed error messages.
