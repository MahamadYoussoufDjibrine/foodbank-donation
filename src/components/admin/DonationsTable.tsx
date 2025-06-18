import React, { useState } from 'react';
import { Clock, MapPin, Phone, Package, Check, X, User, AlertTriangle } from 'lucide-react';
import { useDonations, Donation } from '../../contexts/DonationContext';

interface DonationsTableProps {
  expanded?: boolean;
}

const DonationsTable: React.FC<DonationsTableProps> = ({ expanded = false }) => {
  const { donations, updateDonationStatus, assignVolunteer } = useDonations();
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [volunteerName, setVolunteerName] = useState('');

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Review': return 'bg-orange-100 text-orange-800';
      case 'Approved': return 'bg-blue-100 text-blue-800';
      case 'Assigned': return 'bg-purple-100 text-purple-800';
      case 'In Transit': return 'bg-indigo-100 text-indigo-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const handleApprove = (donation: Donation) => {
    updateDonationStatus(donation.id, 'Approved');
  };

  const handleReject = () => {
    if (selectedDonation && rejectionReason.trim()) {
      updateDonationStatus(selectedDonation.id, 'Rejected', rejectionReason);
      setShowRejectModal(false);
      setSelectedDonation(null);
      setRejectionReason('');
    }
  };

  const handleAssign = () => {
    if (selectedDonation && volunteerName.trim()) {
      assignVolunteer(selectedDonation.id, volunteerName);
      setShowAssignModal(false);
      setSelectedDonation(null);
      setVolunteerName('');
    }
  };

  const handleMarkInTransit = (donation: Donation) => {
    updateDonationStatus(donation.id, 'In Transit');
  };

  const handleMarkCompleted = (donation: Donation) => {
    updateDonationStatus(donation.id, 'Completed');
  };

  const displayDonations = expanded ? donations : donations.slice(0, 5);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Donation Management</h3>
          <p className="text-sm text-gray-500 mt-1">Review and manage food donations</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donation Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location & Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary-100 p-2 rounded-lg">
                        <Package className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{donation.donor}</p>
                        <p className="text-sm text-gray-600">{donation.foodType}</p>
                        <p className="text-xs text-gray-500">Qty: {donation.quantity}</p>
                        <p className="text-xs text-gray-400">ID: {donation.id}</p>
                        {donation.assignedVolunteer && (
                          <p className="text-xs text-blue-600 flex items-center mt-1">
                            <User className="h-3 w-3 mr-1" />
                            {donation.assignedVolunteer}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-900">{donation.location}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {donation.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(donation.urgency)}`}>
                          {donation.urgency}
                        </span>
                        {isExpiringSoon(donation.expiryTime) && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                        {donation.status}
                      </span>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {getTimeUntilExpiry(donation.expiryTime)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-2">
                      {donation.status === 'Pending Review' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(donation)}
                            className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                          >
                            <Check className="h-3 w-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDonation(donation);
                              setShowRejectModal(true);
                            }}
                            className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                          >
                            <X className="h-3 w-3" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                      
                      {donation.status === 'Approved' && (
                        <button
                          onClick={() => {
                            setSelectedDonation(donation);
                            setShowAssignModal(true);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          Assign Volunteer
                        </button>
                      )}
                      
                      {donation.status === 'Assigned' && (
                        <button
                          onClick={() => handleMarkInTransit(donation)}
                          className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 transition-colors"
                        >
                          Mark In Transit
                        </button>
                      )}
                      
                      {donation.status === 'In Transit' && (
                        <button
                          onClick={() => handleMarkCompleted(donation)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                        >
                          Mark Completed
                        </button>
                      )}
                      
                      <button className="text-gray-600 hover:text-gray-800 text-xs font-medium">
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!expanded && donations.length > 5 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <button className="text-primary-600 hover:text-primary-800 font-medium text-sm">
              View All Donations ({donations.length}) →
            </button>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Donation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this donation from {selectedDonation.donor}:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={3}
              placeholder="Enter rejection reason..."
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedDonation(null);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Donation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Volunteer Modal */}
      {showAssignModal && selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Volunteer</h3>
            <p className="text-sm text-gray-600 mb-4">
              Assign a volunteer to collect donation from {selectedDonation.donor}:
            </p>
            <select
              value={volunteerName}
              onChange={(e) => setVolunteerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            >
              <option value="">Select a volunteer...</option>
              <option value="john.smith">John Smith</option>
              <option value="sarah.johnson">Sarah Johnson</option>
              <option value="mike.davis">Mike Davis</option>
              <option value="emily.brown">Emily Brown</option>
              <option value="david.wilson">David Wilson</option>
            </select>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedDonation(null);
                  setVolunteerName('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!volunteerName}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign Volunteer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DonationsTable;