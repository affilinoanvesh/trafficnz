interface SimpleOrderEmailProps {
  customerName?: string;
  customerEmail: string;
  planName: string;
  planPrice: number;
  projectFormUrl: string;
}

export function renderSimpleOrderEmailHTML(props: SimpleOrderEmailProps): string {
  const { customerName, customerEmail, planName, planPrice, projectFormUrl } = props;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Confirmation - Rankings Boost New Zealand</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: #ff4500;
      color: white;
      padding: 30px;
      text-align: center;
    }
    .content {
      padding: 30px;
    }
    .button {
      display: inline-block;
      background: #ff4500;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: normal;
      margin: 20px 0;
    }
    .summary {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
      border-left: 4px solid #ff4500;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 14px;
      padding: 20px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Rankings Boost New Zealand</h1>
      <p>Payment Confirmation</p>
    </div>
    
    <div class="content">
      <p>Dear${customerName ? ` ${customerName}` : ' customer'},</p>
      
      <p>We confirm that your payment has been successfully received.</p>
      
      <div class="summary">
        <h3>Order Details</h3>
        <p><strong>Service:</strong> ${planName}</p>
        <p><strong>Amount:</strong> NZ$ ${planPrice.toFixed(2)}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
      </div>
      
      <h3>Next Step</h3>
      <p>To start your project, we need you to fill in some information about your website and objectives.</p>
      
      <div style="text-align: center;">
        <a href="${projectFormUrl}" class="button" style="display: inline-block; background: #ff4500; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: normal; margin: 20px 0;">
          Fill Project Information
        </a>
      </div>
      
      <p><strong>Important:</strong> Your project will be started after completing the requested information. This process is quick and essential for campaign success.</p>
    </div>
    
    <div class="footer">
      <p><strong>Rankings Boost New Zealand</strong></p>
      <p>Professional SEO Services | Auckland, New Zealand</p>
      <p>Contact: hello@rankingsboost.co.nz</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
      <p style="font-size: 12px; color: #888;">
        This email was sent regarding your SEO service purchase. By using our services, you agree to our terms and conditions. 
        All campaigns are executed professionally with white-hat SEO techniques. Results may vary based on competition and market conditions.
        If you have any questions, please contact our support team.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
