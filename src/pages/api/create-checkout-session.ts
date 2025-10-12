import type { APIRoute } from 'astro';
import Stripe from 'stripe';

// Validate environment variables at startup
const stripeSecretKey = import.meta.env.STRIPE_SECRET_KEY;
const rawSiteUrl = import.meta.env.SITE_URL || import.meta.env.PUBLIC_SITE_URL || 'https://rankingsboost.co.nz';
// Remove trailing slash to prevent double slashes in URLs
const siteUrl = rawSiteUrl.replace(/\/$/, '');

if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY is not configured');
}

// Initialize Stripe with current 2025 API version
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2025-06-30.basil' as Stripe.StripeConfig['apiVersion'], // Latest 2025 API version
  typescript: true,
}) : null;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Enhanced environment validation
    if (!stripe || !stripeSecretKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Stripe configuration error - secret key missing',
          code: 'STRIPE_CONFIG_ERROR'
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request body - must be valid JSON',
          code: 'INVALID_JSON'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { planName, planPrice, customerEmail } = body;

    // Enhanced input validation
    if (!customerEmail || typeof customerEmail !== 'string' || !customerEmail.includes('@')) {
      return new Response(
        JSON.stringify({ 
          error: 'Valid customer email is required',
          code: 'INVALID_EMAIL'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!planName || typeof planName !== 'string') {
      return new Response(
        JSON.stringify({ 
          error: 'Plan name is required',
          code: 'INVALID_PLAN_NAME'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!planPrice || typeof planPrice !== 'number' || planPrice <= 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Valid plan price is required',
          code: 'INVALID_PRICE'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create simple Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'nzd',
            product_data: {
              name: planName,
              description: `Rankings Boost - ${planName}`,
            },
            unit_amount: Math.round(planPrice * 100), // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      allow_promotion_codes: true, // Enable coupon support
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}`,
      metadata: {
        plan_name: planName,
        plan_duration: planName.includes('1 Day') ? '1_day' : 
                       planName.includes('3 Days') ? '3_days' : '1_week',
        customer_email: customerEmail,
        created_at: new Date().toISOString(),
        source: 'website',
      },
    });

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url,
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );

  } catch (error) {
    // Enhanced error handling for different Stripe error types
    if (error instanceof Stripe.errors.StripeError) {
      
      return new Response(
        JSON.stringify({ 
          error: `Stripe error: ${error.message}`,
          code: error.code || 'STRIPE_API_ERROR',
          type: error.type,
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Generic error fallback
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error while creating checkout session',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : String(error))
          : undefined,
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
