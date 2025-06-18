import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, User, Mail, ArrowRight } from 'lucide-react';

const VolunteerLogin: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Mock volunteer identifiers (in real app, this would be validated against a database)
  const validVolunteers = [
    'john.smith',
    'sarah.johnson', 
    'mike.davis',
    'emily.brown',
    'david.wilson',
    'john@foodbank.org',
    'sarah@foodbank.org',
    'mike@foodbank.org',
    'emily@foodbank.org',
    'david@foodbank.org',
    '1001',
    '1002',
    '1003',
    '1004',
    '1005'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const cleanIdentifier = identifier.trim().toLowerCase();
    
    if (!cleanIdentifier) {
      setError('Please enter your volunteer ID, email, or number');
      return;
    }
    
    if (validVolunteers.includes(cleanIdentifier)) {
      navigate(`/volunteer/dashboard/${cleanIdentifier}`);
    } else {
      setError('Invalid volunteer identifier. Please check your ID, email, or number.');
    }
  };

  const quickAccess = [
    { id: 'john.smith', name: 'John Smith', type: 'ID' },
    { id: 'sarah@foodbank.org', name: 'Sarah Johnson', type: 'Email' },
    { id: '1003', name: 'Mike Davis', type: 'Number' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-accent-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-secondary-600 to-accent-600 p-6 text-center">
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Volunteer Access</h1>
          <p className="text-white/80 mt-2">Enter your ID, email, or number</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volunteer Identifier
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                placeholder="Enter ID, email, or number"
                required
              />
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-secondary-600 to-accent-600 text-white py-3 rounded-lg font-semibold hover:from-secondary-700 hover:to-accent-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>Access Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-3">Demo Access - Try these:</h3>
            <div className="space-y-2">
              {quickAccess.map((volunteer) => (
                <button
                  key={volunteer.id}
                  type="button"
                  onClick={() => setIdentifier(volunteer.id)}
                  className="w-full text-left px-3 py-2 bg-white border border-blue-200 rounded text-sm hover:bg-blue-50 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium text-blue-900">{volunteer.name}</span>
                  <div className="flex items-center space-x-2">
                    {volunteer.type === 'Email' && <Mail className="h-3 w-3 text-blue-600" />}
                    {volunteer.type === 'ID' && <User className="h-3 w-3 text-blue-600" />}
                    <span className="text-xs text-blue-600">{volunteer.id}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VolunteerLogin;