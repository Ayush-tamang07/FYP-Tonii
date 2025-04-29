const generatePasswordResetTemplate = (otp) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f5f7;
      color: #333333;
      line-height: 1.6;
    }
    
    .outer-container {
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
    }
    
    .shadow-box {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      border-radius: 16px;
      overflow: hidden;
    }
    
    .container {
      background-color: white;
    }
    
    .banner {
      background-color: #FF9800;
      background-image: linear-gradient(135deg, #FF9800, #F57C00);
      padding: 32px 0;
      text-align: center;
    }
    
    .banner-logo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      padding: 10px;
      background-color: white;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 16px;
    }
    
    .banner-logo img {
      max-width: 100%;
      height: auto;
    }
    
    .banner-text {
      color: white;
      font-size: 28px;
      font-weight: 700;
      margin: 10px 0 0 0;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .content {
      background-color: white;
      padding: 40px;
    }
    
    .greeting {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 16px;
      color: #333333;
    }
    
    .message {
      font-size: 16px;
      margin-bottom: 30px;
      color: #555555;
    }
    
    .code-container {
      margin: 36px 0;
      text-align: center;
    }
    
    .code {
      display: inline-block;
      padding: 16px 36px;
      background-color: #f8f9fa;
      border-radius: 12px;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #212121;
      border: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .expiry {
      font-size: 15px;
      color: #757575;
      margin: 24px 0;
      text-align: center;
      background-color: #fff8e1;
      border-radius: 8px;
      padding: 12px;
      border-left: 4px solid #FFB74D;
    }
    
    .help {
      margin: 30px 0;
      color: #616161;
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      font-size: 15px;
    }
    
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid #eeeeee;
      color: #9e9e9e;
      font-size: 14px;
    }
    
    .social-links {
      margin: 16px 0;
    }
    
    .social-link {
      display: inline-block;
      margin: 0 8px;
      width: 36px;
      height: 36px;
      background-color: #f5f5f5;
      border-radius: 50%;
      line-height: 36px;
    }
    
    .contact-info {
      font-size: 13px;
      color: #9e9e9e;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="outer-container">
    <div class="shadow-box">
      <div class="container">
        <!-- Banner Section -->
        <div class="banner">
          <div class="banner-logo">
            <img src="https://res.cloudinary.com/defp2rb6h/image/upload/v1745516787/logo_rrgnkb.png" alt="Tonii Logo">
          </div>
          <h1 class="banner-text">Password Reset</h1>
        </div>
        
        <!-- Content Section -->
        <div class="content">
          <p class="greeting">Hello there,</p>
          
          <p class="message">We received a request to reset your password for your Tonii account. To verify your identity and continue with the password reset process, please use the verification code below:</p>
          
          <div class="code-container">
            <div class="code">${otp}</div>
          </div>
          
          <p class="expiry">⏱️ This verification code will expire in 6 minutes for security reasons.</p>
          
          <p class="help"><strong>Important:</strong> If you didn't request a password reset, please disregard this email or contact our support team immediately. Your account security is our top priority.</p>
          
          <div class="footer">
            <div class="social-links">
              <a href="#" class="social-link">
                <img src="https://img.icons8.com/ios-glyphs/30/9e9e9e/facebook-new.png" alt="Facebook" width="20" height="20" style="margin-top: 8px;">
              </a>
              <a href="#" class="social-link">
                <img src="https://img.icons8.com/ios-glyphs/30/9e9e9e/twitter.png" alt="Twitter" width="20" height="20" style="margin-top: 8px;">
              </a>
              <a href="#" class="social-link">
                <img src="https://img.icons8.com/ios-glyphs/30/9e9e9e/instagram-new.png" alt="Instagram" width="20" height="20" style="margin-top: 8px;">
              </a>
            </div>
            <p>© ${new Date().getFullYear()} Tonii. All rights reserved.</p>
            <p class="contact-info">
              Need help? Contact us at <a href="mailto:support@tonii.com" style="color: #FF9800; text-decoration: none;">support@tonii.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
};

module.exports = {
  generatePasswordResetTemplate
};