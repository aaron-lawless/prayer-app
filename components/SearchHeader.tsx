import { Box } from '@/components/ui/box';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Search } from 'lucide-react-native';
import React from 'react';

interface SearchHeaderProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function SearchHeader({ 
  placeholder = 'Search...', 
  value = '',
  onChangeText 
}: SearchHeaderProps) {

  return (
    <Box className="px-5 py-4 bg-background-0 border-b border-outline-50">
      <Input variant="rounded" size="md" className="w-full">
        <InputField 
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
        />
        <InputSlot className="pr-3">
          <InputIcon as={Search} color={'#A3A3A3'} />
        </InputSlot>
      </Input>
    </Box>
  );
}
