interface AdminOrderNotificationProps {
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

export function renderAdminOrderNotificationHTML(props: AdminOrderNotificationProps): string {
  const { 
    customerName, 
    customerEmail, 
    planName, 
    planPrice, 
    websiteUrl, 
    keyword1, 
    keyword2, 
    keyword3, 
    totalKeywords, 
    paymentId, 
    paymentDate 
  } = props;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order - Rankings Boost New Zealand</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 700px;
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
      background: #28a745;
      color: white;
      padding: 30px;
      text-align: center;
    }
    .content {
      padding: 30px;
    }
    .section {
      margin: 25px 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid #28a745;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #28a745;
    }
    .detail-row {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #e9ecef;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: bold;
      min-width: 160px;
      color: #495057;
    }
    .detail-value {
      color: #212529;
      flex: 1;
    }
    .keywords-list {
      margin: 10px 0;
      padding-left: 20px;
    }
    .keyword-item {
      padding: 5px 0;
      color: #212529;
    }
    .alert {
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 4px;
      padding: 15px;
      margin: 20px 0;
      color: #856404;
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
      <h1>New Order Received</h1>
      <p>A customer has completed their payment and submitted project details</p>
    </div>
    
    <div class="content">
      <div class="alert">
        <strong>Action Required:</strong> A new SEO campaign is ready for execution. Please review and start the campaign.
      </div>
      
      <div class="section">
        <div class="section-title">Payment Information</div>
        <div class="detail-row">
          <span class="detail-label">Plan:</span>
          <span class="detail-value"><strong>${planName}</strong></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount Paid:</span>
          <span class="detail-value"><strong>NZ$ ${planPrice.toFixed(2)}</strong></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Payment ID:</span>
          <span class="detail-value">${paymentId}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Payment Date:</span>
          <span class="detail-value">${paymentDate}</span>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Customer Information</div>
        <div class="detail-row">
          <span class="detail-label">Name:</span>
          <span class="detail-value">${customerName || 'Not provided'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value"><a href="mailto:${customerEmail}" style="color: #007bff; text-decoration: none;">${customerEmail}</a></span>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Project Details</div>
        <div class="detail-row">
          <span class="detail-label">Website URL:</span>
          <span class="detail-value"><a href="${websiteUrl}" target="_blank" style="color: #007bff; text-decoration: none;">${websiteUrl}</a></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Total Keywords:</span>
          <span class="detail-value"><strong>${totalKeywords}</strong></span>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Target Keywords</div>
        <div class="keywords-list">
          <div class="keyword-item">1. <strong>${keyword1}</strong> (Main Keyword)</div>
          ${keyword2 ? `<div class="keyword-item">2. ${keyword2}</div>` : ''}
          ${keyword3 ? `<div class="keyword-item">3. ${keyword3}</div>` : ''}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Campaign Status</div>
        <div class="detail-row">
          <span class="detail-label">Status:</span>
          <span class="detail-value"><strong style="color: #28a745;">Ready for Execution</strong></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Submitted:</span>
          <span class="detail-value">${new Date().toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' })}</span>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Rankings Boost New Zealand</strong></p>
      <p>Professional SEO Services | Auckland, New Zealand</p>
      <p>Admin Notification System | hello@rankingsboost.co.nz</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
      <p style="font-size: 12px; color: #888;">
        This is an automated order notification. Please review the campaign details and begin execution within 24-48 hours.
        All customer information is confidential. Campaign execution should follow our standard SEO procedures and quality guidelines.
        Contact the customer directly for any clarifications needed.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

