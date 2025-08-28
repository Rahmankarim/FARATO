# Gmail Setup Instructions for Password Reset Emails

## 🚀 Quick Setup Guide

### Step 1: Enable Gmail SMTP in Environment

Your `.env.local` is already configured with the company email. To enable Gmail SMTP:

```bash
# Set email provider to gmail
EMAIL_PROVIDER=gmail

# Your company Gmail account
GMAIL_USER=infobyfarato@gmail.com

# Generate App Password (see Step 2)
GMAIL_APP_PASSWORD=your-16-character-app-password
```

### Step 2: Generate Gmail App Password

1. **Sign in to Gmail** with `infobyfarato@gmail.com`

2. **Enable 2-Factor Authentication** (required for App Passwords):
   - Go to Google Account settings: https://myaccount.google.com/
   - Security > 2-Step Verification > Get Started
   - Follow the setup process

3. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select App: "Mail"
   - Select Device: "Other" → Enter "Farato Website"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

4. **Add to Environment**:
   ```bash
   GMAIL_APP_PASSWORD=abcdefghijklmnop
   ```

### Step 3: Test the Setup

1. **Start your development server**:

   ```bash
   npm run dev
   ```

2. **Test password reset**:
   - Go to `/forgot-password`
   - Enter any registered email
   - Check Gmail for the reset email

### Step 4: Production Setup

For production, ensure these environment variables are set:

```bash
EMAIL_PROVIDER=gmail
GMAIL_USER=infobyfarato@gmail.com
GMAIL_APP_PASSWORD=your-production-app-password
FROM_EMAIL=infobyfarato@gmail.com
COMPANY_EMAIL=infobyfarato@gmail.com
```

## 🔧 How It Works

1. **Email Service** automatically detects Gmail configuration
2. **Password Reset Flow**:
   - User requests reset → API generates secure token
   - Professional email sent from `infobyfarato@gmail.com`
   - User clicks link → redirected to reset password page
   - New password set → token invalidated

## 📧 Email Features

- **Professional Template**: Branded Farato email design
- **Security**: 1-hour token expiry, one-time use
- **Fallback**: Resend API if Gmail fails
- **Development**: Reset links shown in console for testing

## 🛡️ Security Notes

- App passwords are safer than account passwords
- Tokens expire automatically after 1 hour
- Failed email attempts are logged for monitoring
- Production mode hides reset links from API responses

## 🔍 Troubleshooting

**Email not sending?**

1. Verify App Password is correct (16 characters, no spaces)
2. Check Gmail account has 2FA enabled
3. Ensure `EMAIL_PROVIDER=gmail` is set
4. Check server logs for detailed error messages

**Testing in Development:**

- Reset links appear in console logs
- API responses include reset links for easy testing
- All email activity is logged to MongoDB

---

**Ready to test!** Just add your Gmail App Password to `.env.local` and restart the server. 🎉
