import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading/index.native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { FormBuilder, FormField } from '../../components/FormBuilder';
import { RecordManager } from '../../components/RecordManager';
import { useData } from '../../context/DataContext';
import { Contact } from '../../types';

export default function ContactsScreen() {
  const params = useLocalSearchParams();
  const { contacts, addContact, updateContact, deleteContact } = useData();

  const renderContactCard = (contact: Contact) => (
    <Card className="p-4 bg-white border border-gray-200 shadow-sm">
      <VStack space="sm">
        <Text size="lg" className="font-bold text-gray-900">
          {contact.name}
        </Text>

        {contact.relationship && (
          <Box className="bg-black px-3 py-1 rounded-full self-start">
            <Text size="sm" className="text-white font-semibold">
              {contact.relationship}
            </Text>
          </Box>
        )}

        {contact.email && (
          <Text size="sm" className="text-gray-700">{contact.email}</Text>
        )}
        {contact.phone && (
          <Text size="sm" className="text-gray-700">{contact.phone}</Text>
        )}
      </VStack>
    </Card>
  );

  const renderContactForm = (
    formData: Partial<Contact>,
    setFormData: React.Dispatch<React.SetStateAction<Partial<Contact>>>,
    errors: Record<string, string>
  ) => {
    const fields: FormField<Contact>[] = [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'Enter contact name',
        required: true,
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Enter email address',
        keyboardType: 'email-address',
        autoCapitalize: 'none',
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'phone',
        placeholder: 'Enter phone number',
        keyboardType: 'numeric',
        maxLength: 11,
      },
      {
        name: 'relationship',
        label: 'Relationship',
        type: 'dropdown',
        required: true,
        options: [
          { label: 'Friend', id: 'Friend' },
          { label: 'Family', id: 'Family' },
          { label: 'Church', id: 'Church' },
          { label: 'Colleague', id: 'Colleague' },
          { label: 'Other', id: 'Other' },
        ],
      },
      {
        name: 'notes',
        label: 'Notes',
        type: 'textarea',
        placeholder: 'Additional notes about this contact',
      },
    ];

    return (
      <FormBuilder
        fields={fields}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />
    );
  };

  const getInitialFormState = (): Partial<Contact> => ({
    name: '',
    email: '',
    phone: '',
    relationship: undefined,
    notes: '',
  });

  const validateForm = (
    formData: Partial<Contact>
  ): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Name is required';
    }
    if (!formData.relationship || formData.relationship.trim() === '') {
      errors.relationship = 'Relationship is required';
    }
    return errors;
  };

  return (
    <Box className="flex-1 bg-black">
      {/* Gradient Background */}
      <Box style={{ position: 'relative', height: 100 }}>
        <LinearGradient
          colors={['rgba(17,17,17,0.85)', 'rgba(77,76,76,0.85)']}
          style={styles.gradientOverlay}
        />

        {/* ✅ CENTERED HEADER USING NATIVEWIND-FRIENDLY FLEXBOX */}
        <Box className="absolute bottom-4 w-full items-center mb-6">
          <Heading size="xl" className="text-white">
            Contacts
          </Heading>
        </Box>
      </Box>

      {/* Record Manager */}
      <RecordManager
        records={contacts}
        onAdd={addContact}
        onUpdate={updateContact}
        onDelete={deleteContact}
        renderItem={renderContactCard}
        renderForm={renderContactForm}
        getInitialFormState={getInitialFormState}
        validateForm={validateForm}
        filterOptions={[
          { label: 'Friend', value: 'Friend' },
          { label: 'Family', value: 'Family' },
          { label: 'Church', value: 'Church' },
          { label: 'Colleague', value: 'Colleague' },
          { label: 'Other', value: 'Other' },
        ]}
        filterKey="relationship"
        title="Contact"
        addButtonLabel="Add Contact"
        openModalOnMount={params.openModal === 'true'}
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
