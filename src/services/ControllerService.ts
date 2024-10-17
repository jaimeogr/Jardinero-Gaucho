import DatabaseService from './DatabaseService';
import LotService from './LotService';
import UserService from './UserService';
import WorkgroupService from './WorkgroupService';

const initializeServices = () => {
  LotService.initializeLots();
  UserService.initializeUsers();
  WorkgroupService.initializeWorkgroups();
};

export default {
  initializeServices,
};
