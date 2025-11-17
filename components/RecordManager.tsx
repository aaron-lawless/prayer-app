import { Plus, Search, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from './ui/alert-dialog';
import { Box } from './ui/box';
import { Button, ButtonText } from './ui/button';
import { Fab, FabIcon } from './ui/fab';
import { Heading } from './ui/heading/index.native';
import { HStack } from './ui/hstack';
import { Input, InputField, InputIcon, InputSlot } from './ui/input';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from './ui/modal';
import { Pressable } from './ui/pressable';
import { ScrollView } from './ui/scroll-view';
import { Text } from './ui/text';
import { VStack } from './ui/vstack';

export interface FilterOption {
  label: string;
  value: string;
}

export interface RecordManagerStyle {
  containerClassName?: string;
  searchBarClassName?: string;
  contentClassName?: string;
  curvedTop?: boolean;
  topMargin?: number;
}

interface RecordManagerProps<T> {
  records: T[];
  onAdd: (record: Omit<T, 'id'>) => void;
  onUpdate: (id: string, record: Partial<T>) => void;
  onDelete: (id: string) => void;
  renderItem: (record: T) => React.ReactNode;
  renderForm: (
    formData: Partial<T>,
    setFormData: React.Dispatch<React.SetStateAction<Partial<T>>>,
    errors: Record<string, string>
  ) => React.ReactNode;
  getInitialFormState: () => Partial<T>;
  validateForm: (formData: Partial<T>) => Record<string, string>;
  filterRecord?: (record: T, searchQuery: string, selectedFilter: string) => boolean;
  filterOptions?: FilterOption[];
  filterKey?: keyof T;
  defaultFilterValue?: string;
  customStyle?: RecordManagerStyle;
  title: string;
  addButtonLabel: string;
  openModalOnMount?: boolean;
  openRecordIdOnMount?: string;
}

export function RecordManager<T extends { id: string }>({
  records,
  onAdd,
  onUpdate,
  onDelete,
  renderItem,
  renderForm,
  getInitialFormState,
  validateForm,
  filterRecord,
  filterOptions,
  filterKey,
  defaultFilterValue = 'All',
  customStyle,
  title,
  addButtonLabel,
  openModalOnMount = false,
  openRecordIdOnMount,
}: RecordManagerProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<T>>(getInitialFormState());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Default styles
  const defaultStyle: RecordManagerStyle = {
    containerClassName: 'flex-1 bg-background-50',
    searchBarClassName: 'bg-white rounded-t-3xl shadow-sm',
    contentClassName: 'flex-1 bg-white px-4',
    curvedTop: true,
    topMargin: -20,
  };

  const style = { ...defaultStyle, ...customStyle };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>(defaultFilterValue);

  // Default filter function that searches through all string properties
  const defaultFilterRecord = (record: T, query: string, filter: string): boolean => {
    if (!query.trim()) return true;
    
    const lowerQuery = query.toLowerCase();
    return Object.values(record).some(value => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerQuery);
      }
      return false;
    });
  };

  const filterFn = filterRecord || defaultFilterRecord;
  
  // Apply both search and filter
  const filteredRecords = records.filter(record => {
    // Use custom filter function if provided
    if (filterRecord) {
      return filterFn(record, searchQuery, selectedFilter);
    }
    
    // Otherwise use default logic
    const matchesSearch = defaultFilterRecord(record, searchQuery, selectedFilter);
    
    // Then apply category filter if applicable
    if (filterOptions && filterKey && selectedFilter !== 'All') {
      const recordValue = record[filterKey];
      return matchesSearch && recordValue === selectedFilter;
    }
    
    return matchesSearch;
  });

  useEffect(() => {
    if (openModalOnMount) {
      openAddModal();
    } else if (openRecordIdOnMount) {
      const record = records.find(r => r.id === openRecordIdOnMount);
      if (record) {
        handleEdit(record);
      }
    }
  }, [openModalOnMount, openRecordIdOnMount]);

  const openAddModal = () => {
    setFormData(getInitialFormState());
    setEditingId(null);
    setErrors({});
    setModalVisible(true);
  };

  const handleEdit = (record: T) => {
    setFormData(record);
    setEditingId(record.id);
    setErrors({});
    setModalVisible(true);
  };

  const handleSave = () => {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editingId) {
      onUpdate(editingId, formData);
    } else {
      onAdd(formData as Omit<T, 'id'>);
    }
    setModalVisible(false);
    setFormData(getInitialFormState());
    setEditingId(null);
    setErrors({});
  };

  const handleDeleteRecord = (id: string) => {
    setRecordToDelete(id);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      onDelete(recordToDelete);
      setDeleteDialogVisible(false);
      setModalVisible(false);
      setRecordToDelete(null);
    }
  };

  const renderItemWrapper = (record: T) => (
    <Pressable
      key={record.id}
      onPress={() => handleEdit(record)}
      className="mb-3"
    >
      {renderItem(record)}
    </Pressable>
  );

  return (
    <Box className={style.containerClassName}>
      {/* Search Bar with Optional Curved Top */}
      <Box 
        className={style.searchBarClassName} 
        style={style.curvedTop ? { marginTop: style.topMargin } : undefined}
      >
        <Box className="px-4 pt-6 pb-4">
          <Input variant="outline" size="md" className="bg-background-50">
            <InputSlot className="pl-3">
              <InputIcon as={Search} className="text-typography-500" />
            </InputSlot>
            <InputField
              placeholder={`Search ${title.toLowerCase()}s...`}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="text-typography-900"
            />
            {searchQuery.length > 0 && (
              <InputSlot className="pr-3">
                <Pressable onPress={() => setSearchQuery('')}>
                  <InputIcon as={X} className="text-typography-500" />
                </Pressable>
              </InputSlot>
            )}
          </Input>
          
          {/* Filter Options */}
          {filterOptions && filterOptions.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
              <HStack space="sm">
                <Pressable
                  onPress={() => setSelectedFilter('All')}
                  className={`px-4 py-2 rounded-full border ${
                  selectedFilter === 'All'
                    ? 'bg-primary-500 border-primary-500'
                    : 'bg-background-50 border-outline-200'
                }`}
              >
                <Text
                  size="sm"
                  className={`font-semibold ${
                    selectedFilter === 'All' ? 'text-white' : 'text-typography-700'
                  }`}
                >
                  All
                </Text>
              </Pressable>
              {filterOptions.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setSelectedFilter(option.value)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedFilter === option.value
                      ? 'bg-primary-500 border-primary-500'
                      : 'bg-background-50 border-outline-200'
                  }`}
                >
                  <Text
                    size="sm"
                    className={`font-semibold ${
                      selectedFilter === option.value ? 'text-white' : 'text-typography-700'
                    }`}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </HStack>
          </ScrollView>
        )}
        
        {searchQuery.length > 0 && (
          <Text size="sm" className="text-typography-500 mt-2">
            {filteredRecords.length} {filteredRecords.length === 1 ? 'result' : 'results'} found
          </Text>
        )}
        </Box>
      </Box>

      <ScrollView className={style.contentClassName}>
        <VStack space="md" className="pb-20 pt-4">
          {filteredRecords.length > 0 ? (
            filteredRecords.map(record => renderItemWrapper(record))
          ) : searchQuery.length > 0 ? (
            <Box className="items-center justify-center py-12">
              <Text size="lg" className="text-typography-400 text-center">
                No {title.toLowerCase()}s match your search.
              </Text>
              <Text size="sm" className="text-typography-400 text-center mt-2">
                Try adjusting your search terms.
              </Text>
            </Box>
          ) : (
            <Box className="items-center justify-center py-12">
              <Text size="lg" className="text-typography-400 text-center">
                No {title.toLowerCase()}s yet. Tap the + button to add one.
              </Text>
            </Box>
          )}
        </VStack>
      </ScrollView>

      {/* Floating Action Button */}
      <Fab
        size="lg"
        placement="bottom right"
        onPress={openAddModal}
        className="absolute bottom-5 right-5"
      >
        <FabIcon as={Plus} />
      </Fab>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent className="max-w-[90%] max-h-[85%]">
          <ModalHeader className="border-b border-outline-200">
            <Heading size="xl" className="text-typography-900 mb-4">
              {editingId ? `Edit ${title}` : `Add ${title}`}
            </Heading>
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody className="py-4">
            <ScrollView showsVerticalScrollIndicator={false}>
              {renderForm(formData, setFormData, errors)}
            </ScrollView>
          </ModalBody>

          <ModalFooter className="border-t border-outline-200">
            <HStack space="md" className="w-full justify-between items-center mt-4">
              {editingId && (
                <Button
                  size="md"
                  variant="solid"
                  action="secondary"
                  onPress={() => handleDeleteRecord(editingId)}
                >
                  <ButtonText>Delete</ButtonText>
                </Button>
              )}
              <HStack space="sm" className={editingId ? 'ml-auto' : 'w-full justify-end'}>
                <Button
                  size="md"
                  variant="outline"
                  action="secondary"
                  onPress={() => setModalVisible(false)}
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                  size="md"
                  variant="solid"
                  action="primary"
                  onPress={handleSave}
                >
                  <ButtonText>Save</ButtonText>
                </Button>
              </HStack>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteDialogVisible}
        onClose={() => setDeleteDialogVisible(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="lg" className="text-typography-900">
              Confirm Delete
            </Heading>
            <AlertDialogCloseButton />
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text size="md" className="text-typography-700">
              Are you sure you want to delete this {title.toLowerCase()}? This action cannot be undone.
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <HStack space="sm" className="w-full justify-end">
              <Button
                size="md"
                variant="outline"
                action="secondary"
                onPress={() => setDeleteDialogVisible(false)}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                size="md"
                variant="solid"
                action="negative"
                onPress={confirmDelete}
              >
                <ButtonText>Delete</ButtonText>
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
