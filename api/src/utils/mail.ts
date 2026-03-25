import nodemailer from 'nodemailer';

// Check if SMTP is configured
const isSmtpConfigured = (): boolean => {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
};

// Only create transporter if SMTP is configured
const transporter = isSmtpConfigured()
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

interface FeedbackEmailData {
  type: string;
  comment: string;
  screenshot?: string | null;
}

export async function sendFeedbackEmail(data: FeedbackEmailData): Promise<void> {
  // Skip if email is not configured
  if (!isSmtpConfigured()) {
    console.log('Email notifications disabled (SMTP not configured)');
    return;
  }

  // Skip if email notifications are disabled
  if (process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'true') {
    console.log('Email notifications disabled');
    return;
  }

  if (!transporter) {
    console.log('Email transporter not available');
    return;
  }

  const { type, comment, screenshot } = data;

  const typeLabels: Record<string, string> = {
    BUG: 'Bug',
    IDEA: 'Idea',
    OTHER: 'Other',
  };

  const attachments = screenshot
    ? [
        {
          filename: 'screenshot.png',
          content: screenshot.replace(/^data:image\/png;base64,/, ''),
          encoding: 'base64' as const,
        },
      ]
    : [];

  try {
    await transporter.sendMail({
      from: 'Feedback Widget <noreply@feedbackwidget.com>',
      to: process.env.ADMIN_EMAIL,
      subject: `New Feedback: ${typeLabels[type] || type}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8257e6;">New Feedback Received</h2>
          <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Type:</strong> ${typeLabels[type] || type}</p>
            <p><strong>Comment:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #8257e6;">
              ${comment.replace(/\n/g, '<br>')}
            </p>
            ${screenshot ? '<p><strong>Screenshot attached</strong></p>' : ''}
          </div>
          <p style="color: #666; font-size: 12px;">
            Sent from Feedback Widget API
          </p>
        </div>
      `,
      attachments,
    });
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw - we don't want to fail the feedback submission
  }
}
