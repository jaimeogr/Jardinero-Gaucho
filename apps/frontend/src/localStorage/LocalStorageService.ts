// LocalStorageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_ACTIVE_WORKGROUP_KEY = 'LAST_ACTIVE_WORKGROUP';

const getLastActiveWorkgroup = async (): Promise<string | undefined> => {
  try {
    const workgroupId = await AsyncStorage.getItem(LAST_ACTIVE_WORKGROUP_KEY);
    return workgroupId === null ? undefined : workgroupId;
  } catch (error) {
    console.error('Error retrieving last active workgroup:', error);
    return undefined;
  }
};

const setLastActiveWorkgroup = async (workgroupId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LAST_ACTIVE_WORKGROUP_KEY, workgroupId);
  } catch (error) {
    console.error('Error saving last active workgroup:', error);
  }
};

export default {
  getLastActiveWorkgroup,
  setLastActiveWorkgroup,
};
