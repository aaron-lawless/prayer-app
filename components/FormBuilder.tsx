import { Box } from '@/components/ui/box';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView } from '@/components/ui/scroll-view';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectScrollView,
  SelectTrigger,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { ChevronDown, X } from 'lucide-react-native';
import React from 'react';

export type FieldType = 'text' | 'email' | 'phone' | 'textarea' | 'switch' | 'select' | 'dropdown' | 'multiselect';

export interface FormField<T = any> {
  name: keyof T;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
  // For select, dropdown, and multiselect types
  options?: Array<{ id: string; label: string }>;
  renderOption?: (option: any, isSelected: boolean) => React.ReactNode;
  // For multiselect
  maxSelections?: number;
}

interface FormBuilderProps<T> {
  fields: FormField<T>[];
  formData: Partial<T>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<T>>>;
  errors: Record<string, string>;
}

export function FormBuilder<T>({
  fields,
  formData,
  setFormData,
  errors,
}: FormBuilderProps<T>) {
  
  const handleChange = (name: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderField = (field: FormField<T>) => {
    const fieldName = String(field.name);
    const value = formData[field.name];
    const error = errors[fieldName];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <FormControl key={fieldName} isInvalid={!!error} isRequired={field.required}>
            <FormControlLabel>
              <FormControlLabelText>{field.label}</FormControlLabelText>
            </FormControlLabel>
            <Input variant="outline" size="md">
              <InputField
                placeholder={field.placeholder}
                value={value as string || ''}
                onChangeText={(text: string) => handleChange(field.name, text)}
                keyboardType={field.keyboardType || 'default'}
                autoCapitalize={field.autoCapitalize}
                maxLength={field.maxLength || undefined}
              />
            </Input>
            {field.helperText && !error && (
              <FormControlHelper>
                <FormControlHelperText>{field.helperText}</FormControlHelperText>
              </FormControlHelper>
            )}
            {error && (
              <FormControlError>
                <FormControlErrorText>{error}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        );

      case 'textarea':
        return (
          <FormControl key={fieldName} isInvalid={!!error} isRequired={field.required}>
            <FormControlLabel>
              <FormControlLabelText>{field.label}</FormControlLabelText>
            </FormControlLabel>
            <Textarea size="md">
              <TextareaInput
                placeholder={field.placeholder}
                value={value as string || ''}
                onChangeText={(text: string) => handleChange(field.name, text)}
              />
            </Textarea>
            {field.helperText && !error && (
              <FormControlHelper>
                <FormControlHelperText>{field.helperText}</FormControlHelperText>
              </FormControlHelper>
            )}
            {error && (
              <FormControlError>
                <FormControlErrorText>{error}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        );

      case 'switch':
        return (
          <FormControl key={fieldName}>
            <HStack space="md" className="justify-between items-center">
              <VStack className="flex-1">
                <FormControlLabel>
                  <FormControlLabelText>{field.label}</FormControlLabelText>
                </FormControlLabel>
                {field.helperText && (
                  <FormControlHelper>
                    <FormControlHelperText>{field.helperText}</FormControlHelperText>
                  </FormControlHelper>
                )}
              </VStack>
              <Switch
                value={value as boolean || false}
                onValueChange={(val: boolean) => handleChange(field.name, val)}
              />
            </HStack>
          </FormControl>
        );

      case 'select':
        return (
          <FormControl key={fieldName} isInvalid={!!error} isRequired={field.required}>
            <FormControlLabel>
              <FormControlLabelText>{field.label}</FormControlLabelText>
            </FormControlLabel>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space="sm" className="py-2">
                {field.options?.map(option => {
                  const isSelected = value === option.id;
                  
                  if (field.renderOption) {
                    return (
                      <Pressable
                        key={option.id}
                        onPress={() => handleChange(field.name, option.id)}
                      >
                        {field.renderOption(option, isSelected)}
                      </Pressable>
                    );
                  }
                  
                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => handleChange(field.name, option.id)}
                    >
                      <Box className={`px-4 py-2 rounded-full ${isSelected ? 'bg-primary-500' : 'bg-background-100 border border-outline-200'}`}>
                        <Text
                          size="sm"
                          className={isSelected ? 'text-white font-semibold' : 'text-typography-700'}
                        >
                          {option.label}
                        </Text>
                      </Box>
                    </Pressable>
                  );
                })}
              </HStack>
            </ScrollView>
            {field.helperText && !error && (
              <FormControlHelper>
                <FormControlHelperText>{field.helperText}</FormControlHelperText>
              </FormControlHelper>
            )}
            {error && (
              <FormControlError>
                <FormControlErrorText>{error}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        );

      case 'dropdown':
        const selectedOption = field.options?.find(opt => opt.id === value);
        return (
          <FormControl key={fieldName} isInvalid={!!error} isRequired={field.required}>
            <FormControlLabel>
              <FormControlLabelText>{field.label}</FormControlLabelText>
            </FormControlLabel>
            <Select
              selectedValue={value as string}
              onValueChange={(itemValue: string) => handleChange(field.name, itemValue)}
            >
              <SelectTrigger variant="outline" size="md">
                <SelectInput placeholder={field.placeholder || 'Select an option'} />
                <SelectIcon className="mr-3" as={ChevronDown} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectScrollView>
                    {field.options?.map(option => (
                      <SelectItem key={option.id} label={option.label} value={option.id} />
                    ))}
                  </SelectScrollView>
                </SelectContent>
              </SelectPortal>
            </Select>
            {field.helperText && !error && (
              <FormControlHelper>
                <FormControlHelperText>{field.helperText}</FormControlHelperText>
              </FormControlHelper>
            )}
            {error && (
              <FormControlError>
                <FormControlErrorText>{error}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        );

      case 'multiselect':
        const selectedValues = (value as string[]) || [];
        const selectedLabels = field.options
          ?.filter(opt => selectedValues.includes(opt.id))
          .map(opt => opt.label);

        const toggleSelection = (optionId: string) => {
          const currentValues = (value as string[]) || [];
          const newValues = currentValues.includes(optionId)
            ? currentValues.filter(id => id !== optionId)
            : field.maxSelections && currentValues.length >= field.maxSelections
            ? currentValues
            : [...currentValues, optionId];
          handleChange(field.name, newValues);
        };

        const removeSelection = (optionId: string) => {
          const currentValues = (value as string[]) || [];
          handleChange(field.name, currentValues.filter(id => id !== optionId));
        };

        return (
          <FormControl key={fieldName} isInvalid={!!error} isRequired={field.required}>
            <FormControlLabel>
              <FormControlLabelText>{field.label}</FormControlLabelText>
            </FormControlLabel>
            
            {/* Selected Items Display */}
            {selectedLabels && selectedLabels.length > 0 && (
              <Box className="mb-2">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <HStack space="xs" className="py-2">
                    {field.options
                      ?.filter(opt => selectedValues.includes(opt.id))
                      .map(option => (
                        <Box key={option.id} className="bg-primary-500 px-3 py-1.5 rounded-full flex-row items-center">
                          <Text size="sm" className="text-white font-semibold mr-1">
                            {option.label}
                          </Text>
                          <Pressable onPress={() => removeSelection(option.id)}>
                            <X size={14} color="white" />
                          </Pressable>
                        </Box>
                      ))}
                  </HStack>
                </ScrollView>
              </Box>
            )}

            {/* Options List */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space="sm" className="py-2">
                {field.options?.map(option => {
                  const isSelected = selectedValues.includes(option.id);
                  const isDisabled = !isSelected && !!field.maxSelections && selectedValues.length >= field.maxSelections;
                  
                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => toggleSelection(option.id)}
                      disabled={isDisabled}
                    >
                      <Box 
                        className={`px-4 py-2 rounded-full ${
                          isSelected 
                            ? 'bg-primary-500' 
                            : isDisabled
                            ? 'bg-background-50 border border-outline-100'
                            : 'bg-background-100 border border-outline-200'
                        }`}
                      >
                        <Text
                          size="sm"
                          className={
                            isSelected 
                              ? 'text-white font-semibold' 
                              : isDisabled
                              ? 'text-typography-400'
                              : 'text-typography-700'
                          }
                        >
                          {option.label}
                        </Text>
                      </Box>
                    </Pressable>
                  );
                })}
              </HStack>
            </ScrollView>
            
            {field.helperText && !error && (
              <FormControlHelper>
                <FormControlHelperText>
                  {field.helperText}
                  {field.maxSelections && ` (Max: ${field.maxSelections})`}
                </FormControlHelperText>
              </FormControlHelper>
            )}
            {error && (
              <FormControlError>
                <FormControlErrorText>{error}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  return (
    <VStack space="lg">
      {fields.map(field => renderField(field))}
    </VStack>
  );
}
