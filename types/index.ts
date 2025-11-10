import { LucideIcon } from "lucide-react-native";

// Contact represents a person/relationship
export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  relationship?: Relationship;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Relationship = "Friend" | "Family" | "Church" | "Colleague" | "Other";

// Prayer represents a prayer request linked to one or more contacts
export interface Prayer {
  id: string;
  contactIds: string[]; // Array of contact IDs for multiple contacts
  title: string;
  description?: string;
  isAnswered: boolean;
  dateRequested: Date;
  dateAnswered?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// For future Appwrite integration
export interface AppwriteConfig {
  endpoint: string;
  projectId: string;
  databaseId: string;
  contactsCollectionId: string;
  prayersCollectionId: string;
}

export interface Routes {
  icon: LucideIcon;
  label: string;
  route: string;
  showHeader: boolean;
}

export interface QuickAction {
  icon: LucideIcon;
  label: string;
  action: () => void;
}