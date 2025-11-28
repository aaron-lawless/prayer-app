import { BookOpen, Users, Plus, Eye, Check, Search } from 'lucide-react-native';

export const INSTRUCTION_STEPS = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    description: 'Welcome to your personal prayer companion! This app helps you organize and remember to pray for the people and situations that matter most.',
  },
  {
    icon: Users,
    title: 'Add Contacts',
    description: 'Start by adding people you want to pray for. Tap the "Contacts" tab and press the "+" button to add a new contact with their name, email, and phone.',
  },
  {
    icon: Plus,
    title: 'Create Prayer Requests',
    description: 'Go to the "Prayers" tab and tap "+" to create a prayer request. Give it a title, description, and associate it with one or more contacts.',
  },
  {
    icon: Eye,
    title: 'Use Prayer View',
    description: 'From the home screen, tap "Prayer View" to see your prayers one at a time. Swipe through each prayer, and the app will track which ones you\'ve prayed for today.',
  },
  {
    icon: Check,
    title: 'Mark Prayers as Answered',
    description: 'When God answers a prayer, edit the prayer request and mark it as "Answered". Answered prayers won\'t appear in your daily prayer view.',
  },
  {
    icon: Search,
    title: 'Search & Organize',
    description: 'Use the search icon on the home screen to quickly find specific prayers or contacts. You can filter by status or search by keywords.',
  },
];