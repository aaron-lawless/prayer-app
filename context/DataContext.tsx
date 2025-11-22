import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Contact, Prayer } from '../types';

interface DataContextType {
  contacts: Contact[];
  prayers: Prayer[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  setPrayers: React.Dispatch<React.SetStateAction<Prayer[]>>;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  addPrayer: (prayer: Omit<Prayer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePrayer: (id: string, prayer: Partial<Prayer>) => Promise<void>;
  deletePrayer: (id: string) => Promise<void>;
  getPrayersForContact: (contactId: string) => Prayer[];
  getContactsForPrayer: (prayerId: string) => Contact[];
  clearAllData: () => Promise<void>;
  loading: boolean;
  markPrayerAsViewed: (prayerId: string) => Promise<void>;
  getUnviewedPrayersCount: () => number;
  viewedPrayersToday: string[];
  resetViewedPrayers: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const CONTACTS_KEY = '@prayer_app_contacts';
const PRAYERS_KEY = '@prayer_app_prayers';
const VIEWED_PRAYERS_KEY = '@prayer_app_viewed_prayers';
const VIEWED_DATE_KEY = '@prayer_app_viewed_date';

export const DataProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewedPrayersToday, setViewedPrayersToday] = useState<string[]>([]);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save contacts whenever they change
  useEffect(() => {
    if (!loading) {
      saveContacts();
    }
  }, [contacts]);

  // Save prayers whenever they change
  useEffect(() => {
    if (!loading) {
      savePrayers();
    }
  }, [prayers]);

  const loadData = async () => {
    try {
      const [contactsData, prayersData, viewedData, viewedDateData] = await Promise.all([
        AsyncStorage.getItem(CONTACTS_KEY),
        AsyncStorage.getItem(PRAYERS_KEY),
        AsyncStorage.getItem(VIEWED_PRAYERS_KEY),
        AsyncStorage.getItem(VIEWED_DATE_KEY),
      ]);

      if (contactsData) {
        const parsedContacts = JSON.parse(contactsData);
        // Convert date strings back to Date objects
        setContacts(
          parsedContacts.map((c: Contact) => ({
            ...c,
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt),
          })),
        );
      }

      if (prayersData) {
        const parsedPrayers = JSON.parse(prayersData);
        setPrayers(
          parsedPrayers.map((p: Prayer) => ({
            ...p,
            dateRequested: new Date(p.dateRequested),
            dateAnswered: p.dateAnswered ? new Date(p.dateAnswered) : undefined,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
          })),
        );
      }

      // Check if viewed prayers are from today
      const today = new Date().toDateString();
      const lastViewedDate = viewedDateData || '';
      
      if (viewedData && lastViewedDate === today) {
        setViewedPrayersToday(JSON.parse(viewedData));
      } else {
        // Reset if it's a new day
        setViewedPrayersToday([]);
        await AsyncStorage.setItem(VIEWED_DATE_KEY, today);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContacts = async () => {
    try {
      await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
    } catch (error) {
      console.error('Error saving contacts:', error);
    }
  };

  const savePrayers = async () => {
    try {
      await AsyncStorage.setItem(PRAYERS_KEY, JSON.stringify(prayers));
    } catch (error) {
      console.error('Error saving prayers:', error);
    }
  };

  const addContact = async (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newContact: Contact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setContacts(prev => [...prev, newContact]);
  };

  const updateContact = async (id: string, contactData: Partial<Contact>) => {
    setContacts(prev =>
      prev.map(contact =>
        contact.id === id
          ? {...contact, ...contactData, updatedAt: new Date()}
          : contact,
      ),
    );
  };

  const deleteContact = async (id: string) => {
    // Remove the contact from prayers or delete prayers if it's the only contact
    setPrayers(prev => 
      prev.map(prayer => {
        // If this prayer has multiple contacts, just remove this one
        if (prayer.contactIds.length > 1) {
          return {
            ...prayer,
            contactIds: prayer.contactIds.filter(cId => cId !== id),
            updatedAt: new Date(),
          };
        }
        // If this is the only contact, mark for deletion
        return prayer;
      }).filter(prayer => 
        // Remove prayers where this is the only contact
        !(prayer.contactIds.length === 1 && prayer.contactIds.includes(id))
      )
    );
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const addPrayer = async (prayerData: Omit<Prayer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPrayer: Prayer = {
      ...prayerData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setPrayers(prev => [...prev, newPrayer]);
  };

  const updatePrayer = async (id: string, prayerData: Partial<Prayer>) => {
    setPrayers(prev =>
      prev.map(prayer =>
        prayer.id === id
          ? {...prayer, ...prayerData, updatedAt: new Date()}
          : prayer,
      ),
    );
  };

  const deletePrayer = async (id: string) => {
    setPrayers(prev => prev.filter(prayer => prayer.id !== id));
  };

  const getPrayersForContact = (contactId: string): Prayer[] => {
    return prayers.filter(prayer => prayer.contactIds.includes(contactId));
  };

  const getContactsForPrayer = (prayerId: string): Contact[] => {
    const prayer = prayers.find(p => p.id === prayerId);
    if (!prayer) return [];
    
    return contacts.filter(c => prayer.contactIds.includes(c.id));
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.multiRemove([CONTACTS_KEY, PRAYERS_KEY, VIEWED_PRAYERS_KEY, VIEWED_DATE_KEY]);
      setContacts([]);
      setPrayers([]);
      setViewedPrayersToday([]);
      console.log('All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const markPrayerAsViewed = async (prayerId: string) => {
    if (!viewedPrayersToday.includes(prayerId)) {
      const updatedViewed = [...viewedPrayersToday, prayerId];
      setViewedPrayersToday(updatedViewed);
      try {
        await AsyncStorage.setItem(VIEWED_PRAYERS_KEY, JSON.stringify(updatedViewed));
        await AsyncStorage.setItem(VIEWED_DATE_KEY, new Date().toDateString());
      } catch (error) {
        console.error('Error saving viewed prayer:', error);
      }
    }
  };

  const getUnviewedPrayersCount = (): number => {
    const unansweredPrayers = prayers.filter(p => !p.isAnswered);
    const unviewedPrayers = unansweredPrayers.filter(p => !viewedPrayersToday.includes(p.id));
    return unviewedPrayers.length;
  };

  const resetViewedPrayers = async () => {
    setViewedPrayersToday([]);
    try {
      await AsyncStorage.removeItem(VIEWED_PRAYERS_KEY);
      // We keep VIEWED_DATE_KEY as it's still the same day
    } catch (error) {
      console.error('Error resetting viewed prayers:', error);
    }
  };

  return (
    <DataContext.Provider
      value={{
        contacts,
        prayers,
        setContacts,
        setPrayers,
        addContact,
        updateContact,
        deleteContact,
        addPrayer,
        updatePrayer,
        deletePrayer,
        getPrayersForContact,
        getContactsForPrayer,
        clearAllData,
        loading,
        markPrayerAsViewed,
        getUnviewedPrayersCount,
        viewedPrayersToday,
        resetViewedPrayers,
      }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
