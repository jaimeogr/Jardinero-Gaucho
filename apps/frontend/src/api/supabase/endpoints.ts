// endpoints.ts
import camelcaseKeys from 'camelcase-keys';

import supabase from '@/api/supabase/client';
import { NeighbourhoodZoneData, LotInStore } from '@/types/types';

/**
 * Retrieves all workgroups associated with the authenticated user, including their role.
 * @param accountId - The ID of the account to fetch workgroups for.
 * @returns An array of workgroup records with user role details.
 * @throws An error if the query fails (e.g., due to permissions or database issues).
 */
export async function getUserWorkgroupsWithRoles(accountId: string) {
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

  return camelData;
}

export async function getNeighbourhoodZoneData(allTheUsersWorkgroupsIds: string[]): Promise<NeighbourhoodZoneData> {
  const { data: neighbourhoodData, error } = await supabase
    .from('neighborhoods')
    .select('id, label, workgroup_id, zones(id, label)')
    .in('workgroup_id', allTheUsersWorkgroupsIds);

  if (error) {
    console.error('Error fetching neighbourhoods and zones:', error);
    throw error;
  }

  // Transform to NeighbourhoodData structure
  const transformedNeighbourhoods = neighbourhoodData.map((n) => {
    const zones =
      n.zones.map((z) => ({
        zoneId: z.id,
        zoneLabel: z.label,
        isSelected: false,
        isExpanded: false,
      })) || []; // Ensure zones is an empty array if no zones exist
    return {
      neighbourhoodId: n.id,
      neighbourhoodLabel: n.label,
      workgroupId: n.workgroup_id,
      zones,
      isSelected: false,
      isExpanded: false,
    };
  });

  return { neighbourhoods: transformedNeighbourhoods };
}

export async function getLots(allTheUsersWorkgroupsIds: string[]): Promise<LotInStore[]> {
  const { data, error } = await supabase
    .from('lots')
    .select('id, workgroup_id, label, zone_id, last_mowing_date, extra_notes, zones(neighborhood_id)')
    .in('workgroup_id', allTheUsersWorkgroupsIds);

  if (error) {
    console.error('Error fetching lots:', error);
    throw error;
  }

  const lots: LotInStore[] = data.map((lot) => {
    return {
      lotId: lot.id,
      workgroupId: lot.workgroup_id,
      lotLabel: lot.label,
      zoneId: lot.zone_id,
      neighbourhoodId: lot.zones[0].neighborhood_id, // Each lot has one zone
      lastMowingDate: lot.last_mowing_date ? new Date(lot.last_mowing_date) : undefined,
      extraNotes: lot.extra_notes,
    };
  });

  return lots;
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

/**
 * Creates a new lot in the specified workgroup and zone.
 * @param {string} workgroup_id - The ID of the workgroup to which the lot belongs.
 * @param {string} zone_id - The ID of the zone to which the lot belongs.
 * @param {string} label - The label (name) of the new lot.
 * @param {string} [last_mowing_date] - (Optional) The last mowing date in ISO format (e.g., "2023-10-15T12:00:00Z").
 * @param {string} [extra_notes] - (Optional) Extra notes about the lot.
 * @returns {Promise<Object>} The newly created lot record, transformed to camelCase.
 * @throws {Error} If the insertion fails (e.g., due to invalid data or permissions).
 */
export async function createLot(
  workgroup_id: string,
  zone_id: string,
  label: string,
  last_mowing_date: Date | undefined,
  extra_notes: string | undefined,
) {
  // Prepare the data object with required fields
  type LotInsertData = {
    workgroup_id: string;
    zone_id: string;
    label: string;
    last_mowing_date?: Date | null;
    extra_notes?: string | null;
  };
  const insertData: LotInsertData = {
    workgroup_id,
    zone_id,
    label,
    last_mowing_date,
    extra_notes,
  };

  // Insert the data into the 'lots' table and select the inserted record
  const { data, error } = await supabase.from('lots').insert([insertData]).select().single();

  // Handle any insertion errors
  if (error) {
    console.error('Error creating lot:', error.message);
    throw new Error(`Failed to create lot: ${error.message}`);
  }

  // Transform the returned data to match the application's expected format
  const transformedData = {
    ...data,
    lotId: data.id,
    lotLabel: data.label,
  };

  // Convert keys to camelCase for consistency
  const camelData = camelcaseKeys(transformedData, { deep: true });

  console.log('Created lot:\n', JSON.stringify(camelData, null, 2));
  return camelData;
}
