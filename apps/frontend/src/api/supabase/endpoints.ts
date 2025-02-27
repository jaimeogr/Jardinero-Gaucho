// endpoints.ts
import supabase from '@/api/supabase/client';

/**
 * Creates a new workgroup in the database.
 * @param name - The name of the new workgroup.
 * @returns The newly created workgroup record.
 * @throws An error if the insert fails.
 */
export async function createWorkgroup(name: string) {
  // Insert a new workgroup. The id, created_at, and updated_at fields will be auto-generated.
  const { data, error } = await supabase.from('workgroups').insert([{ name }]).single(); // .single() returns a single object instead of an array

  if (error) {
    console.error('Error creating workgroup:', error);
    throw error;
  }

  return data;
}
