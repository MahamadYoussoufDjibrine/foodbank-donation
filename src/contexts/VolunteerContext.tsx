import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  joinDate: Date;
  completedCollections: number;
  rating: number;
  specializations: string[];
  availability: {
    days: string[];
    hours: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
  };
}

interface VolunteerContextType {
  volunteers: Volunteer[];
  addVolunteer: (volunteer: Omit<Volunteer, 'id' | 'joinDate' | 'completedCollections' | 'rating'>) => void;
  updateVolunteer: (id: string, updates: Partial<Volunteer>) => void;
  removeVolunteer: (id: string) => void;
  getVolunteerById: (id: string) => Volunteer | undefined;
  getActiveVolunteers: () => Volunteer[];
  getVolunteerStats: () => {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  };
}

const VolunteerContext = createContext<VolunteerContextType | undefined>(undefined);

export const useVolunteers = () => {
  const context = useContext(VolunteerContext);
  if (context === undefined) {
    throw new Error('useVolunteers must be used within a VolunteerProvider');
  }
  return context;
};

interface VolunteerProviderProps {
  children: ReactNode;
}

export const VolunteerProvider: React.FC<VolunteerProviderProps> = ({ children }) => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    {
      id: 'john.smith',
      name: 'John Smith',
      email: 'john@foodbank.org',
      phone: '+1 (555) 123-4567',
      status: 'Active',
      joinDate: new Date('2024-01-15'),
      completedCollections: 47,
      rating: 4.8,
      specializations: ['Restaurant Pickups', 'Large Events'],
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
        hours: '9:00 AM - 6:00 PM'
      },
      emergencyContact: {
        name: 'Jane Smith',
        phone: '+1 (555) 123-4568'
      }
    },
    {
      id: 'sarah.johnson',
      name: 'Sarah Johnson',
      email: 'sarah@foodbank.org',
      phone: '+1 (555) 987-6543',
      status: 'Active',
      joinDate: new Date('2024-02-20'),
      completedCollections: 32,
      rating: 4.9,
      specializations: ['Bakery Items', 'Grocery Stores'],
      availability: {
        days: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
        hours: '10:00 AM - 8:00 PM'
      }
    },
    {
      id: 'mike.davis',
      name: 'Mike Davis',
      email: 'mike@foodbank.org',
      phone: '+1 (555) 456-7890',
      status: 'Active',
      joinDate: new Date('2023-11-10'),
      completedCollections: 89,
      rating: 4.7,
      specializations: ['Corporate Events', 'Catering Services'],
      availability: {
        days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        hours: '8:00 AM - 5:00 PM'
      }
    },
    {
      id: 'emily.brown',
      name: 'Emily Brown',
      email: 'emily@foodbank.org',
      phone: '+1 (555) 654-3210',
      status: 'Inactive',
      joinDate: new Date('2024-03-05'),
      completedCollections: 15,
      rating: 4.6,
      specializations: ['Small Restaurants', 'Cafes'],
      availability: {
        days: ['Tuesday', 'Thursday', 'Sunday'],
        hours: '11:00 AM - 7:00 PM'
      }
    },
    {
      id: 'david.wilson',
      name: 'David Wilson',
      email: 'david@foodbank.org',
      phone: '+1 (555) 321-0987',
      status: 'Active',
      joinDate: new Date('2023-09-18'),
      completedCollections: 156,
      rating: 4.9,
      specializations: ['Emergency Pickups', 'Large Venues'],
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        hours: '7:00 AM - 9:00 PM'
      },
      emergencyContact: {
        name: 'Lisa Wilson',
        phone: '+1 (555) 321-0988'
      }
    }
  ]);

  const addVolunteer = (volunteerData: Omit<Volunteer, 'id' | 'joinDate' | 'completedCollections' | 'rating'>) => {
    const newVolunteer: Volunteer = {
      ...volunteerData,
      id: volunteerData.email.split('@')[0] || `vol_${Date.now()}`,
      joinDate: new Date(),
      completedCollections: 0,
      rating: 0
    };
    setVolunteers(prev => [newVolunteer, ...prev]);
  };

  const updateVolunteer = (id: string, updates: Partial<Volunteer>) => {
    setVolunteers(prev => prev.map(volunteer => 
      volunteer.id === id ? { ...volunteer, ...updates } : volunteer
    ));
  };

  const removeVolunteer = (id: string) => {
    setVolunteers(prev => prev.filter(volunteer => volunteer.id !== id));
  };

  const getVolunteerById = (id: string) => {
    return volunteers.find(volunteer => volunteer.id === id);
  };

  const getActiveVolunteers = () => {
    return volunteers.filter(volunteer => volunteer.status === 'Active');
  };

  const getVolunteerStats = () => {
    const stats = volunteers.reduce((acc, volunteer) => {
      acc.total++;
      switch (volunteer.status) {
        case 'Active':
          acc.active++;
          break;
        case 'Inactive':
          acc.inactive++;
          break;
        case 'Suspended':
          acc.suspended++;
          break;
      }
      return acc;
    }, { total: 0, active: 0, inactive: 0, suspended: 0 });

    return stats;
  };

  return (
    <VolunteerContext.Provider value={{
      volunteers,
      addVolunteer,
      updateVolunteer,
      removeVolunteer,
      getVolunteerById,
      getActiveVolunteers,
      getVolunteerStats
    }}>
      {children}
    </VolunteerContext.Provider>
  );
};