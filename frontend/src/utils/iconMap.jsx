import React from 'react';
import {
  Hospital,
  Pill,
  ShieldAlert,
  GraduationCap,
  DoorClosed,
  Flame,
  Building2,
  Ambulance,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  HelpCircle,
  Crosshair,
  Compass,
  AlertTriangle,
  HeartPulse,
  Landmark,
  Bus,
  Train,
  Droplets,
  Zap
} from 'lucide-react';

const icons = {
  Hospital,
  Pill,
  ShieldAlert,
  GraduationCap,
  DoorClosed,
  Flame,
  Building2,
  Ambulance,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  HelpCircle,
  Crosshair,
  Compass,
  AlertTriangle,
  HeartPulse,
  Landmark,
  Bus,
  Train,
  Droplets,
  Zap
};

export function CategoryIcon({ name, className = "w-5 h-5", color }) {
  const IconComponent = icons[name] || Building2;
  return <IconComponent className={className} style={color ? { color } : undefined} />;
}

export const availableIconNames = [
  'Hospital',
  'Pill',
  'ShieldAlert',
  'GraduationCap',
  'DoorClosed',
  'Flame',
  'Building2',
  'Ambulance',
  'HeartPulse',
  'Landmark',
  'Bus',
  'Train',
  'Droplets'
];
