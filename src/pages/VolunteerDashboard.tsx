import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDonations } from '../contexts/DonationContext';
import { Package, MapPin, Phone, Clock, CheckCircle, Truck, User, LogOut } from 'lucide-react';

const VolunteerDashboard: React.FC = () => {
  const { volunteerId } = useParams<{ volunteerId: string }>();
  const { donations, updateDonationStatus } = useDonations();
  const navigate = useNavigate();
  const [volunteerName, setVolunteerName] = useState('');

  // Get volunteer's assigned donations
  const volunteerDonations = donations.filter(
    donation => donation.assignedVolunteer === volunteerId && 
    (donation.status === 'Assigned' || donation.status === 'In Transit')
  );

  const completedDonations = donations.filter(
    donation => donation.assignedVolunteer === volunteerId && 
    donation.status === 'Completed'
  );

  useEffect(() => {
    // Set volunteer name based on ID
    const volunteerNames: { [key: string]: string } = {
      'john.smith': 'John Smith',
      'sarah.johnson': 'Sarah Johnson',
      'mike.davis': 'Mike Davis',
      'emily.brown': 'Emily Brown',
      'david.wilson': 'David Wilson',
      'john@foodbank.org': 'John Smith',
      'sarah@foodbank.org': 'Sarah Johnson',
      'mike@foodbank.org': 'Mike Davis',
      'emily@foodbank.org': 'Emily Brown',
      'david@foodbank.org': 'David Wilson'
    };
    
    setVolunteerName(volunteerNames[volunteerId || ''] || volunteerId || 'Volunteer');
  }, [volunteerId]);

  const handleStartCollection = (donationId: string) => {
    updateDonationStatus(donationId, 'In Transit');
  };

  const handleCompleteCollection = (donationId: string) => {
    updateDonationStatus(donationId, 'Completed');
  };

  const getTimeUntilExpiry = (expiryTime: Date) => {
    const hoursUntilExpiry = (expiryTime.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilExpiry < 0) return 'Expired';
    if (hoursUntilExpiry < 1) return `${Math.round(hoursUntilExpiry * 60)}m left`;
    return `${Math.round(hoursUntilExpiry)}h left`;
  };

  const isExpiringSoon = (expiryTime: Date) => {
    const hoursUntilExpiry = (expiryTime.getTime() - Date.now()) / (1000 * 60 * 60);
    return hoursUntilExpiry <= 2 && hoursUntilExpiry > 0;
  };

  const handleLogout = () => {
    navigate('/volunteer');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-secondary-600 to-accent-600 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Volunteer Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome, {volunteerName}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Collections</p>
                <p className="text-3xl font-bold text-secondary-600 mt-2">{volunteerDonations.length}</p>
              </div>
              <div className="bg-secondary-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{completedDonations.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent Collections</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {volunteerDonations.filter(d => isExpiringSoon(d.expiryTime)).length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Collections */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Active Collections</h2>
            <p className="text-sm text-gray-500 mt-1">Donations assigned to you for pickup</p>
          </div>
          
          {volunteerDonations.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No active collections assigned</p>
              <p className="text-sm text-gray-400 mt-1">Check back later for new assignments</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {volunteerDonations.map((donation) => (
                <div key={donation.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-primary-100 p-2 rounded-lg">
                          <Package className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{donation.donor}</h3>
                          <p className="text-sm text-gray-600">{donation.foodType} • {donation.quantity}</p>
                        </div>
                        {isExpiringSoon(donation.expiryTime) && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                            URGENT
                          </span>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Pickup Location</p>
                            <p className="text-sm text-gray-600">{donation.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Contact</p>
                            <p className="text-sm text-gray-600">{donation.phone}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {getTimeUntilExpiry(donation.expiryTime)}
                        </span>
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          ID: {donation.id}
                        </span>
                      </div>
                      
                      {donation.specialInstructions && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <p className="text-sm font-medium text-blue-900">Special Instructions:</p>
                          <p className="text-sm text-blue-700 mt-1">{donation.specialInstructions}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-6 flex flex-col space-y-2">
                      {donation.status === 'Assigned' && (
                        <button
                          onClick={() => handleStartCollection(donation.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Start Collection
                        </button>
                      )}
                      
                      {donation.status === 'In Transit' && (
                        <button
                          onClick={() => handleCompleteCollection(donation.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Mark Completed
                        </button>
                      )}
                      
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        donation.status === 'Assigned' 
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {donation.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Collections */}
        {completedDonations.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recently Completed</h2>
              <p className="text-sm text-gray-500 mt-1">Your successful collections</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {completedDonations.slice(0, 3).map((donation) => (
                <div key={donation.id} className="p-6 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{donation.donor}</h3>
                        <p className="text-xs text-gray-600">{donation.foodType} • {donation.quantity}</p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;