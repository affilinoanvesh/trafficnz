import { useState } from 'react';
import EmailModal from './EmailModal';

interface StripeCheckoutProps {
  planName: string;
  planPrice: number;
  buttonText: string;
  buttonClass?: string;
}

export default function StripeCheckout({ 
  planName, 
  planPrice, 
  buttonText, 
  buttonClass = "btn btn-primary w-full" 
}: StripeCheckoutProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = () => {
    setError(null);
    setShowModal(true);
  };

  const handleEmailSubmit = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email.');
        setLoading(false);
        return;
      }

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName,
          planPrice,
          customerEmail: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing payment');
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setError(null);
    setLoading(false);
  };

  return (
    <>
      <div>
        <button
          className={buttonClass}
          onClick={handleButtonClick}
          disabled={loading}
        >
          {loading ? 'Processing...' : buttonText}
        </button>
        
        {error && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
            {error}
          </div>
        )}
      </div>

      <EmailModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSubmit={handleEmailSubmit}
        planName={planName}
        planPrice={planPrice}
        loading={loading}
      />
    </>
  );
}