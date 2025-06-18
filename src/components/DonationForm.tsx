import React, { useState } from 'react';
import { X, MapPin, Clock, Package, User } from 'lucide-react';
import { useDonations } from '../contexts/DonationContext';

interface DonationFormProps {
  onClose: () => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ onClose }) => {
  const { addDonation } = useDonations();
  const [formData, setFormData] = useState({
    donor: '',
    organizationType: 'restaurant',
    foodType: '',
    quantity: '',
    expiryTime: '',
    location: '',
    phone: '',
    specialInstructions: '',
    urgency: 'Medium' as 'High' | 'Medium' | 'Low'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate urgency based on expiry time
    const expiryDate = new Date(formData.expiryTime);
    const hoursUntilExpiry = (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60);
    
    let urgency: 'High' | 'Medium' | 'Low' = 'Medium';
    if (hoursUntilExpiry <= 2) urgency = 'High';
    else if (hoursUntilExpiry <= 6) urgency = 'Medium';
    else urgency = 'Low';

    addDonation({
      donor: formData.donor,
      organizationType: formData.organizationType,
      foodType: formData.foodType,
      quantity: formData.quantity,
      location: formData.location,
      phone: formData.phone,
      urgency,
      expiryTime: expiryDate,
      specialInstructions: formData.specialInstructions
    });

    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center animate-slide-up">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h3>
          <p className="text-gray-600 mb-6">
            Your donation has been submitted successfully. Our admin team will review and contact you shortly to coordinate pickup.
          </p>
          <div className="text-sm text-gray-500">
            Your donation is now pending admin review
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Submit Food Donation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                Donor Name *
              </label>
              <input
                type="text"
                name="donor"
                required
                value={formData.donor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Your name or organization"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Type *
              </label>
              <select
                name="organizationType"
                required
                value={formData.organizationType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="restaurant">Restaurant</option>
                <option value="event-venue">Event Venue</option>
                <option value="grocery-store">Grocery Store</option>
                <option value="individual">Individual</option>
                <option value="catering">Catering Service</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Package className="h-4 w-4 mr-2 text-gray-400" />
                Food Type *
              </label>
              <input
                type="text"
                name="foodType"
                required
                value={formData.foodType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Prepared meals, Bread, Vegetables"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Quantity *
              </label>
              <input
                type="text"
                name="quantity"
                required
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 50 portions, 10kg, 20 loaves"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                Best Before Time *
              </label>
              <input
                type="datetime-local"
                name="expiryTime"
                required
                value={formData.expiryTime}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              Pickup Address *
            </label>
            <textarea
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Full pickup address with any specific instructions"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Any special handling requirements, dietary information, or additional notes..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Submit Donation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationForm;