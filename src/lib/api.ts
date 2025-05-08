import { User } from '../types';

const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function transformKeys(obj: Record<string, any>, transform: (str: string) => string): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;
    const transformedKey = transform(key);
    result[transformedKey] = value;
  }
  
  return result;
}

export async function getProfile(token: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/profiles`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch profile');
    }

    const data = await response.json();
    if (!data) return null;
    
    return transformKeys(data, toCamelCase) as User;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
}

export async function updateProfile(token: string, profile: Partial<User>): Promise<User> {
  try {
    const cleanProfile = transformKeys(profile, toSnakeCase);

    const response = await fetch(`${API_URL}/profiles`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanProfile),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update profile');
    }

    const data = await response.json();
    return transformKeys(data, toCamelCase) as User;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
}