import type { APIRoute } from 'astro';

// Formspree form endpoint
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjkegrpd';

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
        console.error('Missing required field for Formspree submission');
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

    // Prepare data for Formspree submission
    const formspreeData = {
      // Payment information
      email: submitData['Email'],
      plan: submitData['Plan'],
      amount_paid: submitData['Amount Paid'],
      payment_id: submitData['Payment ID'],
      payment_date: submitData['Payment Date'],
      
      // Project details
      website_url: submitData['Website URL'],
      keyword_1: submitData['Keyword 1'],
      keyword_2: submitData['Keyword 2'] || '',
      keyword_3: submitData['Keyword 3'] || '',
      total_keywords: submitData['Total Keywords'],
      campaign_status: submitData['Campaign Status'] || 'Ready for Execution',
      submission_date: submitData['Submission Date'] || new Date().toISOString(),
      
      // Additional Formspree fields
      _subject: `New SEO Campaign - ${submitData['Plan']} - ${submitData['Email']}`,
      _replyto: submitData['Email'],
      _cc: 'contact@boostseo.co.nz' // Optional: CC to your support email
    };

    // Submit to Formspree
    const formspreeResponse = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formspreeData)
    });

    if (!formspreeResponse.ok) {
      const errorData = await formspreeResponse.json();
      console.error('Formspree API Error:', {
        status: formspreeResponse.status,
        statusText: formspreeResponse.statusText,
        errorData,
        config: {
          endpoint: FORMSPREE_ENDPOINT
        }
      });
      
      return new Response(
        JSON.stringify({ 
          error: `Failed to send data: ${errorData.error || formspreeResponse.statusText}`,
          code: 'FORMSPREE_API_ERROR',
          status: formspreeResponse.status,
          details: errorData
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const result = await formspreeResponse.json();
    console.log('✅ Form submitted to Formspree successfully:', result);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Data submitted successfully',
        submissionId: result.id || 'formspree_submission'
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
        code: 'INTERNAL_ERROR'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
