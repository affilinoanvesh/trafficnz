import { Resend } from 'resend';
import { renderSimpleOrderEmailHTML } from '../components/emails/SimpleOrderEmail';
import { renderAdminOrderNotificationHTML } from '../components/emails/AdminOrderNotification';
import { renderCustomerProjectConfirmationHTML } from '../components/emails/CustomerProjectConfirmation';

// Get environment variables safely
const RESEND_API_KEY = import.meta.env?.RESEND_API_KEY as string | undefined;
const SITE_URL = import.meta.env?.SITE_URL as string | undefined;

// Initialize Resend
const resend = new Resend(RESEND_API_KEY);

export interface OrderConfirmationData {
  customerName?: string;
  customerEmail: string;
  planName: string;
  planPrice: number;
  sessionId: string;
}

export interface ProjectSubmissionData {
  customerName?: string;
  customerEmail: string;
  planName: string;
  planPrice: number;
  websiteUrl: string;
  keyword1: string;
  keyword2?: string;
  keyword3?: string;
  totalKeywords: number;
  paymentId: string;
  paymentDate: string;
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
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not configured');
      return {
        success: false,
        error: 'Email service not configured - missing API key'
      };
    }

    const projectFormUrl = `${SITE_URL || 'https://rankingsboost.co.nz'}/success?session_id=${orderData.sessionId}`;

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

/**
 * Send project submission notification to admin
 */
export async function sendAdminOrderNotification(projectData: ProjectSubmissionData): Promise<EmailResult> {
  try {
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not configured');
      return {
        success: false,
        error: 'Email service not configured - missing API key'
      };
    }

    // Generate admin notification email HTML
    const emailHTML = renderAdminOrderNotificationHTML({
      customerName: projectData.customerName,
      customerEmail: projectData.customerEmail,
      planName: projectData.planName,
      planPrice: projectData.planPrice,
      websiteUrl: projectData.websiteUrl,
      keyword1: projectData.keyword1,
      keyword2: projectData.keyword2,
      keyword3: projectData.keyword3,
      totalKeywords: projectData.totalKeywords,
      paymentId: projectData.paymentId,
      paymentDate: projectData.paymentDate
    });

    // Send email via Resend to admin
    const { data, error } = await resend.emails.send({
      from: 'Rankings Boost NZ Orders <orders@rankingsboost.co.nz>',
      to: ['hello@rankingsboost.co.nz'],
      subject: `🎉 New Order: ${projectData.planName} - ${projectData.customerEmail}`,
      html: emailHTML,
      replyTo: projectData.customerEmail
    });

    if (error) {
      console.error('❌ Failed to send admin notification:', error);
      return {
        success: false,
        error: `Admin notification failed: ${error.message}`
      };
    }

    console.log('✅ Admin order notification sent:', {
      messageId: data?.id,
      to: 'hello@rankingsboost.co.nz'
    });

    return {
      success: true,
      messageId: data?.id
    };

  } catch (error) {
    console.error('❌ Error sending admin notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error'
    };
  }
}

/**
 * Send project confirmation email to customer
 */
export async function sendCustomerProjectConfirmation(projectData: ProjectSubmissionData): Promise<EmailResult> {
  try {
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not configured');
      return {
        success: false,
        error: 'Email service not configured - missing API key'
      };
    }

    // Generate customer confirmation email HTML
    const emailHTML = renderCustomerProjectConfirmationHTML({
      customerName: projectData.customerName,
      customerEmail: projectData.customerEmail,
      planName: projectData.planName,
      websiteUrl: projectData.websiteUrl,
      keyword1: projectData.keyword1,
      keyword2: projectData.keyword2,
      keyword3: projectData.keyword3,
      totalKeywords: projectData.totalKeywords
    });

    // Send email via Resend to customer
    const { data, error } = await resend.emails.send({
      from: 'Rankings Boost New Zealand <noreply@rankingsboost.co.nz>',
      to: [projectData.customerEmail],
      subject: `Project Details Confirmed - ${projectData.planName}`,
      html: emailHTML,
      replyTo: 'hello@rankingsboost.co.nz'
    });

    if (error) {
      console.error('❌ Failed to send customer project confirmation:', error);
      return {
        success: false,
        error: `Customer confirmation failed: ${error.message}`
      };
    }

    console.log('✅ Customer project confirmation sent:', {
      messageId: data?.id,
      to: projectData.customerEmail
    });

    return {
      success: true,
      messageId: data?.id
    };

  } catch (error) {
    console.error('❌ Error sending customer confirmation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error'
    };
  }
}