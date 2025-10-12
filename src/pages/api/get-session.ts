import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover' as Stripe.StripeConfig['apiVersion'], // Latest 2025 API version
  typescript: true,
});

export const GET: APIRoute = async ({ url }) => {
  try {
    const sessionId = url.searchParams.get('session_id');
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return new Response(
        JSON.stringify({ error: 'Payment not completed' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Return the session data needed for the form
    const sessionData = {
      customerEmail: session.customer_details?.email || session.customer_email,
      planName: session.metadata?.plan_name || 'Plan not specified',
      planPrice: session.amount_total ? session.amount_total / 100 : 0,
      paymentId: session.id,
      paymentStatus: session.payment_status,
      currency: session.currency
    };

    console.log('Session data retrieved:', sessionData);
    console.log('Raw session email sources:', {
      customer_details_email: session.customer_details?.email,
      customer_email: session.customer_email,
      customer_id: session.customer
    });

    return new Response(
      JSON.stringify(sessionData),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error fetching session:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch session details',
        code: 'SESSION_FETCH_ERROR'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
