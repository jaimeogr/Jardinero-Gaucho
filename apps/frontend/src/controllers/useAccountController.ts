import useWorkgroupService from '@/services/useWorkgroupService';
import useAccountDataStore from '@/stores/useCurrentAccountStore';
import useWorkgroupStore from '@/stores/useWorkgroupStore';

const useAccountController = () => {
  const currentUser = useAccountDataStore((state) => state.currentUser);

  const createNewWorkgroup = async (workgroupName: string) => {
    const newWorkgroup = await useWorkgroupService.createWorkgroup(workgroupName);
    if (currentUser?.userId) {
      await useWorkgroupService.initializeWorkgroups(currentUser?.userId);
    }
    await useWorkgroupService.setActiveWorkgroup(newWorkgroup.workgroupId);
  };

  return {
    currentUser,
    createNewWorkgroup,
  };
};

export default useAccountController;
