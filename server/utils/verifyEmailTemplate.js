const verifyEmailTemplate = ({ name, url }) => {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Dear ${name},</p>
      <p>Thank you for registering with <strong>Gharbeti-sewa</strong>.</p>
      <p>Please click the button below to verify your email address:</p>
      
      <a href="${url}" 
         style="display: inline-block; padding: 12px 24px; background-color: orange; color: black; 
                text-decoration: none; border-radius: 5px; margin-top: 10px;">
        Verify Email
      </a>

      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p><a href="${url}">${url}</a></p>

      <p>Best regards,<br>Gharbeti-sewa Team</p>
    </div>
  `;
};

export default verifyEmailTemplate;
