import { Resend } from 'resend';
import { renderSimpleOrderEmailHTML } from '../components/emails/SimpleOrderEmail';

// Initialize Resend
const resend = new Resend(import.meta.env.RESEND_API_KEY);

export interface OrderConfirmationData {
  customerName?: string;
  customerEmail: string;
  planName: string;
  planPrice: number;
  sessionId: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send simple order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(orderData: OrderConfirmationData): Promise<EmailResult> {
  try {
    if (!import.meta.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not configured');
      return {
        success: false,
        error: 'Email service not configured - missing API key'
      };
    }

    const projectFormUrl = `${import.meta.env.SITE_URL || 'https://rankingsboost.co.nz'}/success?session_id=${orderData.sessionId}`;

    // Generate simple email HTML
    const emailHTML = renderSimpleOrderEmailHTML({
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      planName: orderData.planName,
      planPrice: orderData.planPrice,
      projectFormUrl: projectFormUrl
    });

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Rankings Boost New Zealand <noreply@rankingsboost.co.nz>',
      to: [orderData.customerEmail],
      subject: `Payment Confirmation - ${orderData.planName}`,
      html: emailHTML,
      replyTo: 'hello@rankingsboost.co.nz'
    });

    if (error) {
      console.error('❌ Failed to send email:', error);
      return {
        success: false,
        error: `Email delivery failed: ${error.message}`
      };
    }

    console.log('✅ Order confirmation email sent:', {
      messageId: data?.id,
      to: orderData.customerEmail
    });

    return {
      success: true,
      messageId: data?.id
    };

  } catch (error) {
    console.error('❌ Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error'
    };
  }
}