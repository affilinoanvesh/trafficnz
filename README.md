# SEO Boost Service - New Zealand

A modern, fast, and SEO-optimised website built with Astro.js for providing SEO ranking boost services.

## 🚀 Features

- **Server-Side Rendering (SSR)** - Optimized for SEO and performance
- **React Integration** - For interactive components and forms
- **Stripe Integration** - Secure payment processing with NZD currency
- **Email System** - Automated order processing and notifications
- **Responsive Design** - Modern UI with Tailwind CSS
- **TypeScript** - Full type safety and better development experience

## 🛠️ Tech Stack

- **Framework**: Astro.js 5.13+
- **UI Library**: React 19+
- **Styling**: Tailwind CSS 4+
- **Payments**: Stripe API
- **Email**: Resend API
- **Language**: TypeScript
- **Deployment**: Netlify

## 📦 Project Structure

```
/
├── public/
│   ├── images/
│   └── favicon files
├── src/
│   ├── components/
│   │   ├── EmailModal.tsx
│   │   ├── StripeCheckout.tsx
│   │   ├── ProjectDetailsForm.tsx
│   │   └── ...
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── api/
│   │   │   ├── create-checkout-session.ts
│   │   │   ├── submit-project.ts
│   │   │   └── webhook.ts
│   │   ├── index.astro
│   │   ├── success.astro
│   │   └── ...
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── package.json
└── tailwind.config.mjs
```

## 🏃‍♂️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Your site will be available at `http://localhost:4321`

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_...
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Configuration  
RESEND_API_KEY=re_...

# Site Configuration
SITE_URL=https://yourdomain.com
```

### Stripe Setup

1. Create a Stripe account
2. Get your API keys from the Stripe dashboard
3. Set up webhook endpoints for payment processing
4. Configure products and pricing in your Stripe dashboard

## 🚀 Deployment

This project is configured for Netlify deployment:

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

## 📚 Key Components

- **StripeCheckout**: Handles payment processing
- **EmailModal**: Collects customer information
- **ProjectDetailsForm**: Post-payment project setup
- **API Routes**: Handle payments, webhooks, and form submissions

## 🔒 Security

- Environment variables for sensitive data
- Stripe webhook signature verification
- Input validation and sanitization
- HTTPS enforcement in production

## 📄 License

Private - All rights reserved

## 🤝 Support

For technical support or questions, please contact the development team.