let lastUsedWorkgroup = '1';

const getLastUsedWorkgroup = () => {
  return lastUsedWorkgroup;
};

const setLastUsedWorkgroup = (workgroup: string) => {
  lastUsedWorkgroup = workgroup;
};

export default {
  getLastUsedWorkgroup,
  setLastUsedWorkgroup,
};
