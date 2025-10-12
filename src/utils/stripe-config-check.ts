/**
 * Stripe Configuration Validation Utility
 * Run this to verify your Stripe setup is correct
 */

interface ConfigCheck {
  name: string;
  value: string | undefined;
  required: boolean;
  valid: boolean;
  message: string;
}

export function validateStripeConfig(): ConfigCheck[] {
  const checks: ConfigCheck[] = [
    {
      name: 'STRIPE_SECRET_KEY',
      value: import.meta.env.STRIPE_SECRET_KEY,
      required: true,
      valid: false,
      message: ''
    },
    {
      name: 'PUBLIC_STRIPE_PUBLISHABLE_KEY',
      value: import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY,
      required: true,
      valid: false,
      message: ''
    },
    {
      name: 'SITE_URL',
      value: import.meta.env.SITE_URL || import.meta.env.PUBLIC_SITE_URL,
      required: true,
      valid: false,
      message: ''
    },
    {
      name: 'STRIPE_WEBHOOK_SECRET',
      value: import.meta.env.STRIPE_WEBHOOK_SECRET,
      required: false,
      valid: false,
      message: ''
    }
  ];

  // Validate each configuration
  checks.forEach(check => {
    if (!check.value) {
      check.valid = !check.required;
      check.message = check.required 
        ? `❌ Missing required environment variable`
        : `⚠️ Optional but recommended for production`;
      return;
    }

    // Validate Stripe secret key format
    if (check.name === 'STRIPE_SECRET_KEY') {
      if (check.value.startsWith('sk_test_') || check.value.startsWith('sk_live_')) {
        check.valid = true;
        check.message = check.value.startsWith('sk_test_') 
          ? `✅ Test mode key detected`
          : `✅ Live mode key detected`;
      } else {
        check.valid = false;
        check.message = `❌ Invalid format - should start with 'sk_test_' or 'sk_live_'`;
      }
    }

    // Validate publishable key format
    if (check.name === 'PUBLIC_STRIPE_PUBLISHABLE_KEY') {
      if (check.value.startsWith('pk_test_') || check.value.startsWith('pk_live_')) {
        check.valid = true;
        check.message = check.value.startsWith('pk_test_') 
          ? `✅ Test mode key detected`
          : `✅ Live mode key detected`;
      } else {
        check.valid = false;
        check.message = `❌ Invalid format - should start with 'pk_test_' or 'pk_live_'`;
      }
    }

    // Validate URL format
    if (check.name === 'SITE_URL') {
      try {
        new URL(check.value);
        check.valid = true;
        check.message = `✅ Valid URL format`;
      } catch {
        check.valid = false;
        check.message = `❌ Invalid URL format`;
      }
    }

    // Validate webhook secret format
    if (check.name === 'STRIPE_WEBHOOK_SECRET') {
      if (check.value.startsWith('whsec_')) {
        check.valid = true;
        check.message = `✅ Valid webhook secret format`;
      } else {
        check.valid = false;
        check.message = `❌ Invalid format - should start with 'whsec_'`;
      }
    }
  });

  return checks;
}

export function logConfigStatus(): void {
  console.log('\n🔧 Stripe Configuration Check');
  console.log('================================');
  
  const checks = validateStripeConfig();
  let allValid = true;
  
  checks.forEach(check => {
    console.log(`${check.name}: ${check.message}`);
    if (check.required && !check.valid) {
      allValid = false;
    }
  });
  
  console.log('\n================================');
  if (allValid) {
    console.log('✅ All required configurations are valid!');
  } else {
    console.log('❌ Please fix the configuration errors above');
    console.log('\n💡 Setup instructions:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Add your Stripe keys from https://dashboard.stripe.com/apikeys');
    console.log('3. Set your SITE_URL (e.g., http://localhost:4321 for dev)');
  }
  console.log('================================\n');
}

// Auto-run in development
if (import.meta.env.DEV) {
  logConfigStatus();
}
