interface CustomerProjectConfirmationProps {
  customerName?: string;
  customerEmail: string;
  planName: string;
  websiteUrl: string;
  keyword1: string;
  keyword2?: string;
  keyword3?: string;
  totalKeywords: number;
}

export function renderCustomerProjectConfirmationHTML(props: CustomerProjectConfirmationProps): string {
  const { 
    customerName, 
    customerEmail, 
    planName, 
    websiteUrl, 
    keyword1, 
    keyword2, 
    keyword3, 
    totalKeywords 
  } = props;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Details Received - Rankings Boost New Zealand</title>
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
    .success-icon {
      text-align: center;
      font-size: 48px;
      margin: 20px 0;
    }
    .summary {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
      border-left: 4px solid #ff4500;
    }
    .detail-row {
      padding: 8px 0;
      border-bottom: 1px solid #e9ecef;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: bold;
      color: #495057;
      display: inline-block;
      min-width: 140px;
    }
    .keywords-list {
      margin: 10px 0;
      padding-left: 20px;
    }
    .keyword-item {
      padding: 3px 0;
    }
    .timeline {
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 4px;
      padding: 15px;
      margin: 20px 0;
    }
    .timeline-title {
      font-weight: bold;
      color: #856404;
      margin-bottom: 10px;
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
      <p>Project Details Confirmed</p>
    </div>
    
    <div class="content">
      <div class="success-icon">✅</div>
      
      <p>Dear${customerName ? ` ${customerName}` : ' customer'},</p>
      
      <p>Thank you! We have successfully received your project details and your SEO campaign is now queued for execution.</p>
      
      <div class="summary">
        <h3>Your Project Summary</h3>
        <div class="detail-row">
          <span class="detail-label">Plan:</span>
          <span>${planName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Website:</span>
          <span><a href="${websiteUrl}" style="color: #ff4500; text-decoration: none;">${websiteUrl}</a></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Total Keywords:</span>
          <span>${totalKeywords}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Target Keywords:</span>
          <div class="keywords-list">
            <div class="keyword-item">• ${keyword1}</div>
            ${keyword2 ? `<div class="keyword-item">• ${keyword2}</div>` : ''}
            ${keyword3 ? `<div class="keyword-item">• ${keyword3}</div>` : ''}
          </div>
        </div>
      </div>
      
      <div class="timeline">
        <div class="timeline-title">⏱️ What Happens Next?</div>
        <ol style="margin: 10px 0; padding-left: 20px; color: #856404;">
          <li>Our team will review your project details (within 24 hours)</li>
          <li>We'll start building high-quality backlinks to your website</li>
          <li>You'll receive regular progress updates via email</li>
          <li>Track your keyword rankings improvement over time</li>
        </ol>
      </div>
      
      <p><strong>Important:</strong> Your campaign will begin within 24-48 hours. We focus on quality over speed to ensure the best results for your website.</p>
      
      <p>If you have any questions or need to update your project details, please don't hesitate to contact us.</p>
    </div>
    
    <div class="footer">
      <p><strong>Rankings Boost New Zealand</strong></p>
      <p>Questions? Contact us: <a href="mailto:hello@rankingsboost.co.nz" style="color: #ff4500; text-decoration: none;">hello@rankingsboost.co.nz</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

