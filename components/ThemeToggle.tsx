import { Moon, Sun } from 'lucide-react-native';
import { Button, ButtonIcon } from './ui/button';
import { HStack } from './ui/hstack';
import { Text } from './ui/text';

interface ThemeToggleProps {
  currentMode: 'light' | 'dark';
  onToggle: () => void;
  showLabel?: boolean;
}

export function ThemeToggle({ currentMode, onToggle, showLabel = false }: ThemeToggleProps) {
  return (
    <Button
      size="md"
      variant="outline"
      action="secondary"
      onPress={onToggle}
      className="flex-row items-center"
    >
      <HStack space="sm" className="items-center">
        <ButtonIcon
          as={currentMode === 'light' ? Moon : Sun}
          className="text-typography-900"
        />
        {showLabel && (
          <Text className="text-typography-900 font-medium">
            {currentMode === 'light' ? 'Dark' : 'Light'} Mode
          </Text>
        )}
      </HStack>
    </Button>
  );
}
