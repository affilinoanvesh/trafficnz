import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { sendOrderConfirmationEmail } from '../../utils/email-service';

// Initialize Stripe with latest API version
const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil' as Stripe.StripeConfig['apiVersion'], // Latest 2025 API version
  typescript: true,
});

const endpointSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;



export const POST: APIRoute = async ({ request }) => {
  console.log('🔔 Webhook received');

  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      console.error('❌ Missing Stripe signature');
      return new Response('Missing signature', { status: 400 });
    }

    if (!endpointSecret) {
      console.error('❌ Missing webhook endpoint secret');
      return new Response('Webhook not configured', { status: 500 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
      console.log('✅ Webhook signature verified:', event.type);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return new Response('Invalid signature', { status: 400 });
    }

    // Handle the event with enhanced logging
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Payment successful for session:', session.id);
        
        // Extract important data
        const paymentData = {
          sessionId: session.id,
          customerEmail: session.customer_details?.email || session.customer_email,
          amountTotal: session.amount_total,
          currency: session.currency,
          planName: session.metadata?.plan_name,
          planDuration: session.metadata?.plan_duration,
          customerId: session.customer,
          paymentStatus: session.payment_status,
          createdAt: new Date(session.created * 1000).toISOString(),
        };
        
        console.log('💰 Payment details:', paymentData);
        
        // Send simple order confirmation email for any successful payment
        if (paymentData.customerEmail && paymentData.planName) {
          try {
            const emailResult = await sendOrderConfirmationEmail({
              customerEmail: paymentData.customerEmail,
              customerName: session.customer_details?.name || undefined,
              planName: paymentData.planName,
              planPrice: paymentData.amountTotal ? paymentData.amountTotal / 100 : 0, // Convert from cents to currency units, default to 0
              sessionId: paymentData.sessionId
            });

            if (emailResult.success) {
              console.log('✅ Order confirmation email sent successfully:', {
                messageId: emailResult.messageId,
                to: paymentData.customerEmail,
                plan: paymentData.planName
              });
            } else {
              console.error('❌ Failed to send order confirmation email:', emailResult.error);
              // Don't fail the webhook - payment is still valid even if email fails
            }
          } catch (emailError) {
            console.error('❌ Error in email sending process:', emailError);
            // Don't fail the webhook - payment is still valid
          }
        } else {
          console.warn('⚠️ Missing required data for order confirmation email:', {
            customerEmail: !!paymentData.customerEmail,
            planName: !!paymentData.planName
          });
        }
        
        console.log('✅ Payment confirmed, waiting for project details form submission');
        
        break;
      
      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        console.log('⏰ Checkout session expired:', expiredSession.id);
        // Handle expired sessions (analytics, cleanup, etc.)
        break;
      
      case 'payment_intent.succeeded':
        const successfulPayment = event.data.object as Stripe.PaymentIntent;
        console.log('✅ Payment intent succeeded:', successfulPayment.id);
        break;
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('❌ Payment failed:', {
          id: failedPayment.id,
          lastError: failedPayment.last_payment_error,
          amount: failedPayment.amount,
        });
        // Handle failed payments (retry logic, notifications, etc.)
        break;
      
      case 'customer.created':
        const customer = event.data.object as Stripe.Customer;
        console.log('👤 New customer created:', customer.id);
        // Handle new customer creation
        break;
      
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return new Response('Webhook processing failed', { status: 500 });
  }
};
