import sgMail from '@sendgrid/mail';

export default class EmailManager {
  recipientEmail;
  senderEmail;
  sendgridApiKey;

  constructor(sendgridApiKey, senderEmail, recipientEmail) {
    this.sendgridApiKey = sendgridApiKey;
    this.senderEmail = senderEmail;
    this.recipientEmail = recipientEmail;
    this.validateConfigValues();
    this.initializeSendGrid();
  }

  validateConfigValues(){
    const missingOrInvalidValues = [];
    
    if (!this.sendgridApiKey || typeof this.sendgridApiKey !== 'string') {
        missingOrInvalidValues.push("SendGrid API key");
    }
    if (!this.senderEmail || typeof this.senderEmail !== 'string') {
        missingOrInvalidValues.push("Sender email");
    }
    if (!this.recipientEmail || typeof this.recipientEmail !== 'string') {
        missingOrInvalidValues.push("Recipient email");
    }

    if (missingOrInvalidValues.length) {
        throw new Error(`Missing or invalid config values for the EmailManager: ${missingOrInvalidValues.join(", ")}`);
    }
  }

  initializeSendGrid() {
    sgMail.setApiKey(this.sendgridApiKey);
  }


  async sendEmail(subject, emailContent){
    await sgMail.send({
      to: this.recipientEmail,
      from: this.senderEmail,
      subject,
      html: emailContent,
    });
  }

  generateAppTestEmailContent(appName, publisher) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333333; }
            .container { max-width: 600px; padding: 20px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; }
            h2 { color: #0078d4; }
            .footer { font-size: 0.9em; color: #666666; margin-top: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>New App Test Request</h2>
            <p>We have received a request to test the following application:</p>
            <p><strong>App Name:</strong> ${appName}</p>
            <p><strong>Publisher:</strong> ${publisher || '-'}</p>
            <p>Please proceed with the testing process at your earliest convenience.</p>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }  
}
