import { useState } from 'react';

interface ProjectDetailsFormProps {
  customerEmail: string;
  planName: string;
  planPrice: number;
  paymentId: string;
}

export default function ProjectDetailsForm({ 
  customerEmail, 
  planName, 
  planPrice, 
  paymentId 
}: ProjectDetailsFormProps) {
  const [formData, setFormData] = useState({
    websiteUrl: '',
    mainKeyword: '',
    additionalKeywords: '',
    agreeToStart: false
  });
  
  const [formErrors, setFormErrors] = useState({
    websiteUrl: '',
    mainKeyword: '',
    agreeToStart: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const errors = { websiteUrl: '', mainKeyword: '', agreeToStart: '' };
    let isValid = true;

    // Website URL validation
    if (!formData.websiteUrl) {
      errors.websiteUrl = 'Website URL is required';
      isValid = false;
    } else if (!formData.websiteUrl.match(/^https?:\/\/.+\..+/)) {
      errors.websiteUrl = 'Enter a valid URL (e.g: https://yoursite.co.nz)';
      isValid = false;
    }

    // Main keyword validation
    if (!formData.mainKeyword.trim()) {
      errors.mainKeyword = 'Main keyword is required';
      isValid = false;
    }

    // Agreement validation
    if (!formData.agreeToStart) {
      errors.agreeToStart = 'You must authorize the campaign start';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const submissionData = {
        // Payment info (pre-filled)
        'Email': customerEmail,
        'Plan': planName,
        'Amount Paid': planPrice,
        'Payment ID': paymentId,
        'Payment Date': new Date().toISOString(),
        
        // Project details (user input)
        'Website URL': formData.websiteUrl,
        'Keyword 1': formData.mainKeyword,
        'Keyword 2': formData.additionalKeywords.split(',')[0]?.trim() || '',
        'Keyword 3': formData.additionalKeywords.split(',')[1]?.trim() || '',
        'Total Keywords': formData.additionalKeywords ? formData.additionalKeywords.split(',').filter(k => k.trim()).length + 1 : 1,
        
        // Status tracking
        'Campaign Status': 'Ready for Execution',
        'Submission Date': new Date().toISOString()
      };

      // Submit to our API endpoint (which handles Formspree integration)
      const response = await fetch('/api/submit-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to send data');
      }

      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error sending data. Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white border border-gray-200 p-8 rounded-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Data Sent Successfully!
          </h3>
          
          <p className="text-gray-600 mb-6">
            We have received all your project information. Our team will start your campaign within 24 hours.
          </p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-sm font-medium text-orange-800 mb-2">
              📧 You will receive a confirmation email shortly
            </div>
            <div className="text-sm text-orange-700">
              With the detailed schedule of your campaign and tracking information.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 p-8 rounded-lg">
      <div className="text-mono text-sm text-gray-500 mb-4">[ PROJECT DETAILS ]</div>
      <h2 className="text-xl font-bold mb-6 text-gray-900">
        Configure Your Boost Campaign
      </h2>
      
      {/* Payment Summary - Read Only */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
        <div className="text-sm font-medium text-gray-500 mb-3">Payment Summary:</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{customerEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Plan:</span>
            <span className="font-medium">{planName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium text-green-600">${planPrice.toFixed(2)} NZD</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Website URL */}
        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Your website URL *
          </label>
          <input
            type="url"
            id="websiteUrl"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
              formErrors.websiteUrl ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://yoursite.co.nz"
            required
            disabled={isSubmitting}
          />
          {formErrors.websiteUrl && (
            <p className="mt-1 text-xs text-red-600">{formErrors.websiteUrl}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Include the protocol (https://) and complete address
          </p>
        </div>

        {/* Main Keyword */}
        <div>
          <label htmlFor="mainKeyword" className="block text-sm font-medium text-gray-700 mb-2">
            Main keyword *
          </label>
          <input
            type="text"
            id="mainKeyword"
            name="mainKeyword"
            value={formData.mainKeyword}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
              formErrors.mainKeyword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g: business consulting"
            required
            disabled={isSubmitting}
          />
          {formErrors.mainKeyword && (
            <p className="mt-1 text-xs text-red-600">{formErrors.mainKeyword}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            The most important keyword you want to rank for
          </p>
        </div>

        {/* Additional Keywords - Only show for plans other than "1 Day" */}
        {planName !== '1 Day' && (
          <div>
            <label htmlFor="additionalKeywords" className="block text-sm font-medium text-gray-700 mb-2">
              Additional keywords <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              id="additionalKeywords"
              name="additionalKeywords"
              value={formData.additionalKeywords}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="e.g: financial consulting, strategic consulting"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple keywords with commas (maximum 3 for your plan)
            </p>
          </div>
        )}

        {/* Info message for 1 Day plan */}
        {planName === '1 Day' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <div className="text-sm font-medium text-blue-800">
                  1 Day Plan
                </div>
                <div className="text-sm text-blue-700">
                  This plan includes only 1 main keyword. For multiple keywords, consider our 3-day or 1-week plans.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agreement Checkbox */}
        <div>
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="agreeToStart"
              checked={formData.agreeToStart}
              onChange={handleInputChange}
              className={`mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 ${
                formErrors.agreeToStart ? 'border-red-500' : ''
              }`}
              required
              disabled={isSubmitting}
            />
            <span className="text-sm text-gray-600 leading-relaxed">
              I authorize the start of the traffic boost campaign with the information provided above. 
              I understand that the campaign will begin within 24 hours after submitting this form.
            </span>
          </label>
          {formErrors.agreeToStart && (
            <p className="mt-1 text-xs text-red-600">{formErrors.agreeToStart}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
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
                Sending...
              </span>
            ) : (
              'START MY CAMPAIGN'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
