import type { APIRoute } from 'astro';
import { sendAdminOrderNotification, sendCustomerProjectConfirmation } from '../../utils/email-service';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse request body
    let submitData;
    try {
      submitData = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request body',
          code: 'INVALID_JSON'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate required fields
    const requiredFields = ['Email', 'Plan', 'Website URL', 'Keyword 1'];
    for (const field of requiredFields) {
      if (!submitData[field]) {
        console.error(`Missing required field: ${field}`, submitData);
        return new Response(
          JSON.stringify({ 
            error: `Required field missing: ${field}`,
            code: 'MISSING_REQUIRED_FIELD',
            receivedData: Object.keys(submitData)
          }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Prepare project submission data
    const projectData = {
      customerName: submitData['Customer Name'] || undefined, // Optional field
      customerEmail: submitData['Email'],
      planName: submitData['Plan'],
      planPrice: parseFloat(submitData['Amount Paid']) || 0,
      websiteUrl: submitData['Website URL'],
      keyword1: submitData['Keyword 1'],
      keyword2: submitData['Keyword 2'] || undefined,
      keyword3: submitData['Keyword 3'] || undefined,
      totalKeywords: parseInt(submitData['Total Keywords']) || 1,
      paymentId: submitData['Payment ID'],
      paymentDate: submitData['Payment Date'] || new Date().toISOString()
    };

    console.log('📧 Sending project submission emails...');

    // Send email to admin (hello@rankingsboost.co.nz)
    const adminEmailResult = await sendAdminOrderNotification(projectData);
    
    if (!adminEmailResult.success) {
      console.error('❌ Failed to send admin notification:', adminEmailResult.error);
      // Continue anyway - we don't want to fail the submission
    } else {
      console.log('✅ Admin notification sent successfully');
    }

    // Send confirmation email to customer
    const customerEmailResult = await sendCustomerProjectConfirmation(projectData);
    
    if (!customerEmailResult.success) {
      console.error('❌ Failed to send customer confirmation:', customerEmailResult.error);
      // Continue anyway - we don't want to fail the submission
    } else {
      console.log('✅ Customer confirmation sent successfully');
    }

    // Determine response based on email results
    const emailStatus = {
      adminEmail: adminEmailResult.success ? 'sent' : 'failed',
      customerEmail: customerEmailResult.success ? 'sent' : 'failed',
      adminMessageId: adminEmailResult.messageId,
      customerMessageId: customerEmailResult.messageId
    };

    console.log('✅ Project submission processed:', emailStatus);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Project details submitted successfully',
        emailStatus: emailStatus
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error submitting project data:', error);
    
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
