import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { FormBuilder, FormField } from '../../components/FormBuilder';
import { RecordManager } from '../../components/RecordManager';
import { useData } from '../../context/DataContext';
import { Prayer } from '../../types';
import { Heading } from '@/components/ui/heading/index.native';

export default function PrayersScreen() {
  const params = useLocalSearchParams();
  const { prayers, contacts, addPrayer, updatePrayer, deletePrayer, getContactsForPrayer } = useData();

  const renderPrayerCard = (prayer: Prayer) => {
    const prayerContacts = getContactsForPrayer(prayer.id);

    return (
      <Card className="p-4 bg-white border border-gray-200 shadow-sm">
        <VStack space="sm">
          <Text size="lg" className="font-bold text-gray-900">{prayer.title}</Text>
          
          {prayer.isAnswered && (
            <Box className="bg-black px-3 py-1 rounded-full self-start">
              <Text size="sm" className="text-white font-semibold">
                ✓ Answered
              </Text>
            </Box>
          )}

          {prayerContacts.length > 0 && (
            <HStack space="xs" className="flex-wrap">
              {prayerContacts.map(contact => (
                <Box key={contact.id} className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text size="sm" className="text-gray-700 font-semibold">{contact.name}</Text>
                </Box>
              ))}
            </HStack>
          )}
          {prayer.description && (
            <Text size="sm" className="text-gray-700">{prayer.description}</Text>
          )}
          <Text size="xs" className="text-gray-500">
            Requested: {new Date(prayer.dateRequested).toLocaleDateString()}
          </Text>
          {prayer.isAnswered && prayer.dateAnswered && (
            <Text size="xs" className="text-gray-600 font-semibold">
              Answered on {new Date(prayer.dateAnswered).toLocaleDateString()}
            </Text>
          )}
        </VStack>
      </Card>
    );
  };

  const renderPrayerForm = (
    formData: Partial<Prayer>,
    setFormData: React.Dispatch<React.SetStateAction<Partial<Prayer>>>,
    errors: Record<string, string>
  ) => {
    const fields: FormField<Prayer>[] = [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        placeholder: 'Prayer request title',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Detailed prayer request',
      },
      {
        name: 'contactIds',
        label: 'Contacts',
        type: 'multiselect',
        placeholder: 'Select contacts',
        required: true,
        options: contacts.map(c => ({ id: c.id, label: c.name })),
      },
      {
        name: 'isAnswered',
        label: 'Mark as Answered',
        type: 'switch',
        helperText: 'Toggle when prayer is answered',
      },
    ];

    return <FormBuilder fields={fields} formData={formData} setFormData={setFormData} errors={errors} />;
  };

  const getInitialFormState = (): Partial<Prayer> => ({
    title: '',
    description: '',
    contactIds: [],
    isAnswered: false,
    dateRequested: new Date(),
  });

  const validateForm = (formData: Partial<Prayer>): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!formData.title || formData.title.trim() === '') {
      errors.title = 'Title is required';
    }
    if (!formData.contactIds || formData.contactIds.length === 0) {
      errors.contactIds = 'Please select at least one contact';
    }
    return errors;
  };

  const handleAdd = (prayer: Omit<Prayer, 'id'>) => {
    addPrayer({
      ...prayer,
      dateAnswered: prayer.isAnswered ? new Date() : undefined,
    });
  };

  const handleUpdate = (id: string, updates: Partial<Prayer>) => {
    const oldPrayer = prayers.find(p => p.id === id);
    const wasAnswered = oldPrayer?.isAnswered;
    const isNowAnswered = updates.isAnswered;

    if (!wasAnswered && isNowAnswered) {
      updates.dateAnswered = new Date();
    } else if (wasAnswered && !isNowAnswered) {
      updates.dateAnswered = undefined;
    }

    updatePrayer(id, updates);
  };

  return (
    <Box className="flex-1 bg-black">
      {/* Gradient Background */}
      <Box style={{ position: 'relative', height: 100 }}>
        <LinearGradient
          colors={['rgba(17,17,17,0.85)', 'rgba(77,76,76,0.85)']}
          style={styles.gradientOverlay}
        />

        {/* Centered Header */}
        <Box className="absolute bottom-4 w-full items-center mb-6">
          <Heading size="xl" className="text-white">
            Prayers
          </Heading>
        </Box>
      </Box>

      {/* Record Manager */}
      <RecordManager
        records={prayers}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={deletePrayer}
        renderItem={renderPrayerCard}
        renderForm={renderPrayerForm}
        getInitialFormState={getInitialFormState}
        validateForm={validateForm}
        filterOptions={[
          { label: 'Unanswered', value: 'unanswered' },
          { label: 'Answered', value: 'answered' },
        ]}
        filterRecord={(prayer, searchQuery, currentFilter) => {
          // Search filter
          const matchesSearch = !searchQuery.trim() || 
            prayer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (prayer.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
          
          // If no match on search, return false
          if (!matchesSearch) return false;
          
          // Status filter
          if (currentFilter === 'unanswered') {
            return !prayer.isAnswered;
          } else if (currentFilter === 'answered') {
            return prayer.isAnswered;
          }
          
          // 'All' filter or no filter
          return true;
        }}
        defaultFilterValue="unanswered"
        title="Prayer Request"
        addButtonLabel="Add Prayer Request"
        openModalOnMount={params.openModal === 'true'}
        openRecordIdOnMount={typeof params.openPrayerId === 'string' ? params.openPrayerId : undefined}
        customStyle={{
          containerClassName: 'flex-1 bg-white',
          searchBarClassName: 'bg-white rounded-t-3xl shadow-sm',
          contentClassName: 'flex-1 bg-white px-4',
          curvedTop: true,
          topMargin: -20,
        }}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  gradientOverlay: {
    width: '100%',
    height: '100%',
  },
});
