import { Box } from '@/components/ui/box';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Search } from 'lucide-react-native';
import React from 'react';
import { useColorScheme } from 'react-native';

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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box className="px-5 py-4 bg-background-0 border-b border-outline-50">
      <Input variant="rounded" size="md" className="w-full">
        <InputField 
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
        />
        <InputSlot className="pr-3">
          <InputIcon as={Search} color={isDark ? '#A3A3A3' : '#737373'} />
        </InputSlot>
      </Input>
    </Box>
  );
}
