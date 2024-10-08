// This will handle global state gracefully, pray for it my friend

import { makeAutoObservable, observable } from 'mobx';

import { UserInterface } from '../types/types';

class UserStore {
  users: UserInterface[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  initializeUsers(users: UserInterface[]) {
    this.setUsers(users);
  }

  setUsers(users: UserInterface[]) {
    this.users = observable(users);
  }

  getUserById(id: number): UserInterface | undefined {
    return this.users.find((user) => user.id === id);
  }

  addUser(user: UserInterface) {
    this.users.push(user);
  }

  updateUser(id: number, updatedInfo: Partial<UserInterface>) {
    const user = this.users.find((user) => user.id === id);
    if (user) {
      Object.assign(user, updatedInfo);
    }
  }

  removeUser(id: number) {
    this.users = this.users.filter((user) => user.id !== id);
  }
}

const userStore = new UserStore();
export default userStore;
