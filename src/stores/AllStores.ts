import lotStore from './LotStore';
import userStore from './UserStore';
import LotService from '../services/LotService';
import UserService from '../services/UserService';

// Unified initialization function that fetches data and populates the stores
export const initializeStores = async () => {
  try {
    // Fetch the initial data for lots and users
    const lotsData = LotService.getFirstLoadOfLots(); // Synchronous or can be async
    const usersData = UserService.getMyTeam(); // Synchronous or can be async

    // Initialize each store with the fetched data
    userStore.initializeUsers(usersData);
    lotStore.initializeLots(lotsData);
  } catch (error) {
    console.error('Error initializing stores:', error);
  }
};

export default {
  userStore,
  lotStore,
};
