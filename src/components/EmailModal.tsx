import { useState } from 'react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  planName: string;
  planPrice: number;
  loading?: boolean;
}

export default function EmailModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  planName, 
  planPrice, 
  loading = false 
}: EmailModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    acceptTerms: false
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    acceptTerms: ''
  });


  const validateForm = () => {
    const errors = { email: '', acceptTerms: '' };
    let isValid = true;

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Terms validation
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData.email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ email: '', acceptTerms: false });
      setFormErrors({ email: '', acceptTerms: '' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        {/* Close button */}
        {!loading && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Complete Purchase
          </h2>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500 mb-1">Selected plan:</div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              Boost SEO - {planName}
            </div>
            <div className="text-2xl font-black text-orange-600">
              ${planPrice.toFixed(2)} NZD
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="modal-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                formErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="seu@email.com"
              required
              disabled={loading}
            />
            {formErrors.email && (
              <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div>
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className={`mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 ${
                  formErrors.acceptTerms ? 'border-red-500' : ''
                }`}
                required
                disabled={loading}
              />
              <span className="text-sm text-gray-600 leading-relaxed">
                I accept the{' '}
                <a 
                  href="/terms" 
                  target="_blank" 
                  className="text-orange-600 hover:text-orange-700 underline"
                >
                  terms and conditions
                </a>
                {' '}and{' '}
                <a 
                  href="/privacy" 
                  target="_blank" 
                  className="text-orange-600 hover:text-orange-700 underline"
                >
                  privacy policy
                </a>
              </span>
            </label>
            {formErrors.acceptTerms && (
              <p className="mt-1 text-xs text-red-600">{formErrors.acceptTerms}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg 
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
