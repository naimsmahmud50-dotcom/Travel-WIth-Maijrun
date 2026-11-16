import fs from 'fs';
import { getStorageFilePath, sanitizeText } from '@/lib/security';
import { DESTINATIONS, DestinationItem } from '@/lib/destinations';

export interface AdminDestinationItem extends DestinationItem {
  priceUsd?: string;
  isCustom?: boolean;
  updatedAt?: string;
}

function getDestinationsFilePath(): string {
  return getStorageFilePath('destinations.json');
}

export function readDestinationsFromStore(): AdminDestinationItem[] {
  const filePath = getDestinationsFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const items = content ? JSON.parse(content) : [];
      if (Array.isArray(items) && items.length > 0) {
        return items;
      }
    }
  } catch (err) {
    console.error('Warning: Failed to read destinations from storage:', err);
  }

  // Fallback to static catalog
  return DESTINATIONS.map((d) => ({
    ...d,
    priceUsd: '$5,000+',
  }));
}

export function writeDestinationsToStore(items: AdminDestinationItem[]): boolean {
  const filePath = getDestinationsFilePath();
  try {
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Warning: Failed to write destinations to storage:', err);
    return false;
  }
}

export function updateDestinationInStore(
  id: string,
  updates: Partial<AdminDestinationItem>
): { success: boolean; item?: AdminDestinationItem; error?: string } {
  const items = readDestinationsFromStore();
  const index = items.findIndex((d) => d.id === id);
  if (index === -1) {
    return { success: false, error: 'Destination not found' };
  }

  const current = items[index];
  const updatedItem: AdminDestinationItem = {
    ...current,
    title: updates.title ? sanitizeText(updates.title, 120) : current.title,
    country: updates.country ? sanitizeText(updates.country, 80) : current.country,
    region: updates.region ? sanitizeText(updates.region, 80) : current.region,
    tag: updates.tag ? sanitizeText(updates.tag, 60) : current.tag,
    duration: updates.duration ? sanitizeText(updates.duration, 60) : current.duration,
    desc: updates.desc ? sanitizeText(updates.desc, 500) : current.desc,
    priceBdt: updates.priceBdt ? sanitizeText(updates.priceBdt, 40) : current.priceBdt,
    priceUsd: updates.priceUsd ? sanitizeText(updates.priceUsd, 40) : (current.priceUsd || '$5,000+'),
    image: updates.image && updates.image.startsWith('http') ? updates.image.trim() : current.image,
    updatedAt: new Date().toISOString(),
  };

  items[index] = updatedItem;
  const written = writeDestinationsToStore(items);
  return { success: written, item: updatedItem };
}

export function createDestinationInStore(
  newItem: Partial<AdminDestinationItem>
): { success: boolean; item?: AdminDestinationItem; error?: string } {
  const items = readDestinationsFromStore();
  const title = sanitizeText(newItem.title || '', 120);
  const country = sanitizeText(newItem.country || '', 80);

  if (!title || !country) {
    return { success: false, error: 'Title and Country are required.' };
  }

  const rawId = newItem.id || country.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const id = `${rawId}-${Date.now().toString(36)}`;

  const item: AdminDestinationItem = {
    id,
    destKey: newItem.destKey || 'custom',
    category: (newItem.category as any) || 'heritage',
    tag: sanitizeText(newItem.tag || 'Bespoke Haven', 60),
    duration: sanitizeText(newItem.duration || '7 Days • 6 Nights', 60),
    country,
    region: sanitizeText(newItem.region || country, 80),
    title,
    desc: sanitizeText(
      newItem.desc || 'Curated ultra-luxury halal journey tailored for discerning travelers.',
      500
    ),
    priceBdt: sanitizeText(newItem.priceBdt || '৳800,000', 40),
    priceUsd: sanitizeText(newItem.priceUsd || '$6,500', 40),
    image:
      newItem.image && newItem.image.startsWith('http')
        ? newItem.image.trim()
        : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=75&w=640&auto=format&fit=crop',
    styles: Array.isArray(newItem.styles) && newItem.styles.length > 0 ? newItem.styles : ['heritage', 'family'],
    seasons: Array.isArray(newItem.seasons) && newItem.seasons.length > 0 ? newItem.seasons : ['any'],
    isCustom: true,
    updatedAt: new Date().toISOString(),
  };

  items.push(item);
  const written = writeDestinationsToStore(items);
  return { success: written, item };
}

export function deleteDestinationFromStore(id: string): { success: boolean; id?: string; error?: string } {
  const items = readDestinationsFromStore();
  const index = items.findIndex((d) => d.id === id);
  if (index === -1) {
    return { success: false, error: 'Destination not found.' };
  }

  const deleted = items.splice(index, 1)[0];
  const written = writeDestinationsToStore(items);
  return { success: written, id: deleted.id };
}
