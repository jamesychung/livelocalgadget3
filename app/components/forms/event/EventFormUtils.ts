import { Equipment } from './EventFormTypes';

// Generate time options (every half hour)
export const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(time);
    }
  }
  return times;
};

// Default equipment data
export const getDefaultEquipment = (): Equipment[] => [
  {
    item: "Power Outlets",
    venueProvides: true,
    musicianProvides: false,
    notes: "Accessible, grounded outlets near performance area are a must"
  },
  {
    item: "PA System",
    venueProvides: false,
    musicianProvides: true,
    notes: "Musicians often bring portable PA (e.g. Bose, JBL, Yamaha)"
  },
  {
    item: "Microphones",
    venueProvides: false,
    musicianProvides: true,
    notes: "Vocal mics, sometimes instrument mics"
  },
  {
    item: "Mic Stands & Cables",
    venueProvides: false,
    musicianProvides: true,
    notes: "Musicians bring all essentials"
  },
  {
    item: "Instruments",
    venueProvides: false,
    musicianProvides: true,
    notes: "Guitars, keyboards, etc."
  },
  {
    item: "Amps (Guitar/Bass)",
    venueProvides: false,
    musicianProvides: true,
    notes: "Small/medium amps for compact spaces"
  },
  {
    item: "Monitors (Stage)",
    venueProvides: false,
    musicianProvides: false,
    notes: "Not usually provided; some musicians use in-ear monitors or small wedges"
  },
  {
    item: "Lighting",
    venueProvides: true,
    musicianProvides: false,
    notes: "Basic ambient only; Optional portable lighting can help if venue is dim"
  }
];

// Available genres for events
export const availableGenres = [
  "Rock", "Pop", "Jazz", "Blues", "Country", "Folk", "Electronic", "Hip Hop", 
  "R&B", "Classical", "Reggae", "Latin", "World Music", "Alternative", "Indie",
  "Metal", "Punk", "Soul", "Funk", "Gospel", "Bluegrass", "EDM", "House", "Techno"
]; 