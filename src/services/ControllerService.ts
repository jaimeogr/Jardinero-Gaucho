import DatabaseService from './DatabaseService';
import LotService from './LotService';
import UserService from './UserService';
import WorkgroupService from './WorkgroupService';

const initializeServices = () => {
  LotService.initializeLots();
  UserService.initializeUsers();
  WorkgroupService.initializeWorkgroups();
};

const markLotCompletedForSpecificDate = (lotId: string, date?: Date) => {
  LotService.markLotCompletedForSpecificDate(lotId, date);
};

const markSelectedLotsCompletedForSpecificDate = (date?: Date) => {
  return LotService.markSelectedLotsCompletedForSpecificDate(date);
};

export default {
  initializeServices,
  markLotCompletedForSpecificDate,
  markSelectedLotsCompletedForSpecificDate,
};
