import nodemailer from 'nodemailer'
import crypto from 'crypto'

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

console.log('📧 Email Service Initialized')
console.log('SMTP Host:', process.env.SMTP_HOST || 'smtp.ethereal.email')
console.log('SMTP Port:', process.env.SMTP_PORT || '587')
console.log('SMTP User:', process.env.SMTP_USER ? '(Set)' : '(Not Set)')

// Generate random token
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Send verification email
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3646'}/auth/verify?token=${token}`

  const mailOptions = {
    from: process.env.SMTP_FROM || '"TRAKYTT" <noreply@trakytt.com>',
    to: email,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #09090b;">Welcome to TRAKYTT!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #09090b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #71717a; font-size: 14px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
        <p style="color: #71717a; font-size: 14px;">
          Or copy and paste this link: <br/>
          <a href="${verificationUrl}">${verificationUrl}</a>
        </p>
      </div>
    `,
  }

  try {
    console.log(`📧 Attempting to send verification email to: ${email}`)
    const info = await transporter.sendMail(mailOptions)
    console.log('--------------------------------------------------')
    console.log('📧 Verification Email Sent')
    console.log('To:', email)
    console.log('Message ID:', info.messageId)
    console.log('🔗 Verification Link:', verificationUrl)
    console.log('--------------------------------------------------')

    // For Ethereal testing
    if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info))
    }

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending verification email:', error)
    return { success: false, error }
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3646'}/auth/reset-password?token=${token}`

  const mailOptions = {
    from: process.env.SMTP_FROM || '"TRAKYTT" <noreply@trakytt.com>',
    to: email,
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #09090b;">Password Reset Request</h2>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #09090b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #71717a; font-size: 14px;">
          This link will expire in 1 hour.
        </p>
        <p style="color: #71717a; font-size: 14px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
        <p style="color: #71717a; font-size: 14px;">
          Or copy and paste this link: <br/>
          <a href="${resetUrl}">${resetUrl}</a>
        </p>
      </div>
    `,
  }

  try {
    console.log(`📧 Attempting to send password reset email to: ${email}`)
    const info = await transporter.sendMail(mailOptions)
    console.log('--------------------------------------------------')
    console.log('📧 Password Reset Email Sent')
    console.log('To:', email)
    console.log('Message ID:', info.messageId)
    console.log('🔗 Reset Link:', resetUrl)
    console.log('--------------------------------------------------')

    // For Ethereal testing
    if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info))
    }

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return { success: false, error }
  }
}
