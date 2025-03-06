// endpoints.ts
import camelcaseKeys from 'camelcase-keys';

import supabase from '@/api/supabase/client';

/**
 * Retrieves all workgroups associated with the authenticated user, including their role.
 * @param accountId - The ID of the account to fetch workgroups for.
 * @returns An array of workgroup records with user role details.
 * @throws An error if the query fails (e.g., due to permissions or database issues).
 */
export async function getUserWorkgroupsWithRoles(accountId: string) {
  console.log('getUserWorkgroupsWithRoles:', accountId);
  const { data, error } = await supabase
    .from('account_workgroups')
    .select(
      `
      workgroup_id,
      role,
      has_accepted_presence,
      access_to_all_lots,
      workgroups (
        id,
        name,
        created_at,
        updated_at
      )
    `,
    )
    .eq('account_id', accountId);
  if (error) {
    console.error('Error fetching workgroups with roles:', error);
    throw error;
  }
  console.log('getUserWorkgroupsWithRoles:\n', JSON.stringify(data, null, 2));

  // Transform the data to a flatter structure
  const flattenedData =
    data?.map((item) => ({
      workgroupId: item.workgroups.id,
      name: item.workgroups.name,
      created_at: item.workgroups.created_at,
      updated_at: item.workgroups.updated_at,
      role: item.role,
      has_accepted_presence: item.has_accepted_presence,
      access_to_all_lots: item.access_to_all_lots,
    })) || [];

  const camelData = camelcaseKeys(flattenedData, { deep: true });
  console.log('getUserWorkgroupsWithRoles:\n', JSON.stringify(camelData, null, 2));

  return camelData;
}

/**
 * Creates a new workgroup in the database.
 * @param name - The name of the new workgroup.
 * @returns The newly created workgroup record.
 * @throws An error if the insert fails.
 */
export async function createWorkgroup(name: string) {
  // Insert a new workgroup. The id, created_at, and updated_at fields will be auto-generated.
  const { data, error } = await supabase.from('workgroups').insert([{ name }]).select().single();

  if (error) {
    console.error('Error creating workgroup:', error);
    throw error;
  }
  const camelData = camelcaseKeys(data, { deep: true });
  console.log('createWorkgroup:\n', JSON.stringify(camelData, null, 2));

  return data;
}

/**
 * Creates a new neighborhood in the specified workgroup.
 * @param workgroup_id - The ID of the workgroup to which the neighborhood belongs.
 * @param label - The label (name) of the new neighborhood.
 * @returns The newly created neighborhood record.
 * @throws An error if the insert fails (e.g., due to permissions or invalid data).
 */
export async function createNeighborhood(workgroup_id: string, label: string) {
  const { data, error } = await supabase.from('neighborhoods').insert([{ workgroup_id, label }]).select().single();

  if (error) {
    console.error('Error creating neighborhood:', error);
    throw error;
  }

  const transformedData = { ...data, neighbourhoodId: data.id, neighbourhoodLabel: data.label };
  const camelData = camelcaseKeys(transformedData, { deep: true });
  return camelData;
}

/**
 * Creates a new zone in the specified neighborhood and workgroup.
 * @param workgroup_id - The ID of the workgroup to which the zone belongs.
 * @param neighborhood_id - The ID of the neighborhood to which the zone belongs.
 * @param label - The label (name) of the new zone.
 * @returns The newly created zone record.
 * @throws An error if the insert fails (e.g., due to permissions or invalid data).
 */
export async function createZone(workgroup_id: string, neighborhood_id: string, label: string) {
  const { data, error } = await supabase
    .from('zones')
    .insert([{ workgroup_id, neighborhood_id, label }])
    .select()
    .single();

  if (error) {
    console.error('Error creating zone:', error);
    throw error;
  }

  const transformedData = { ...data, zoneId: data.id, zoneLabel: data.label };

  const camelData = camelcaseKeys(transformedData, { deep: true });
  console.log('createZone:\n', JSON.stringify(camelData, null, 2));

  return camelData;
}
