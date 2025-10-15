import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Get environment variables safely
const RESEND_API_KEY = import.meta.env?.RESEND_API_KEY as string | undefined;

// Initialize Resend
const resend = new Resend(RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse request body
    let formData;
    try {
      formData = await request.json();
    } catch (error) {
      console.error('❌ Invalid JSON in request body:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request format',
          code: 'INVALID_JSON'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate required fields
    const { name, email, phone, company, projectType, budget, message } = formData;

    if (!name || !email) {
      return new Response(
        JSON.stringify({ 
          error: 'Name and email are required',
          code: 'MISSING_REQUIRED_FIELDS'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid email format',
          code: 'INVALID_EMAIL'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('📧 Processing contact form submission:', {
      name,
      email,
      projectType,
      budget
    });

    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Email service not configured',
          code: 'EMAIL_SERVICE_ERROR'
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate admin notification email HTML
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin: 0 0 10px 0;">New Website Inquiry</h2>
          <p style="color: #666; margin: 0;">Someone has submitted a contact form for website building services.</p>
        </div>
        
        <div style="background-color: white; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
          <h3 style="color: #333; margin: 0 0 15px 0;">Contact Details</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #333; width: 150px;">Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #333;">Email:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;">${email}</td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #333;">Phone:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;">${phone}</td>
            </tr>
            ` : ''}
            ${company ? `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #333;">Company:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;">${company}</td>
            </tr>
            ` : ''}
            ${projectType ? `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #333;">Project Type:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;">${projectType}</td>
            </tr>
            ` : ''}
            ${budget ? `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #333;">Budget:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;">${budget}</td>
            </tr>
            ` : ''}
          </table>
          
          ${message ? `
          <h3 style="color: #333; margin: 20px 0 10px 0;">Message</h3>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #ff4500;">
            <p style="margin: 0; color: #666; line-height: 1.5;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          ` : ''}
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            This inquiry was submitted from the Rankings Boost website contact form.
          </p>
        </div>
      </div>
    `;

    // Send email via Resend to admin
    const { data, error } = await resend.emails.send({
      from: 'Rankings Boost Website Inquiries <inquiries@rankingsboost.co.nz>',
      to: ['hello@rankingsboost.co.nz'],
      subject: `New Website Inquiry from ${name}`,
      html: emailHTML,
      replyTo: email
    });

    if (error) {
      console.error('❌ Failed to send contact form email:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email',
          code: 'EMAIL_SEND_ERROR',
          details: error.message
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Contact form email sent:', {
      messageId: data?.id,
      from: email,
      to: 'hello@rankingsboost.co.nz'
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Thank you for your inquiry! We\'ll get back to you within 24 hours.',
        messageId: data?.id
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
