import {
  LotInterface,
  NeighbourhoodZoneData,
  NeighbourhoodData,
  WorkgroupInterface,
  UserInterface,
} from '../types/types';

const getNeighbourhoodZoneData = (
  lots?: LotInterface[],
): NeighbourhoodZoneData => {
  const neighbourhoodMap: { [key: string]: NeighbourhoodData } = {};

  if (!lots) {
    lots = getMyLots();
  }

  lots.forEach((lot) => {
    const {
      neighbourhoodId,
      neighbourhoodLabel,
      zoneId,
      zoneLabel,
      workgroupId,
    } = lot;

    // Initialize neighbourhood if it doesn't exist
    if (!neighbourhoodMap[neighbourhoodId]) {
      neighbourhoodMap[neighbourhoodId] = {
        workgroupId,
        neighbourhoodId,
        neighbourhoodLabel,
        isSelected: false,
        assignedTo: [],
        zones: [],
      };
    }

    const neighbourhood = neighbourhoodMap[neighbourhoodId];

    // Check if the zone already exists in the neighbourhood
    const zoneExists = neighbourhood.zones.some(
      (zone) => zone.zoneId === zoneId,
    );

    // Add the zone if it doesn't exist
    if (!zoneExists) {
      neighbourhood.zones.push({
        zoneId,
        zoneLabel,
        isSelected: false,
        assignedTo: [],
      });
    }
  });

  // Convert the neighbourhoodMap to an array
  return { neighbourhoods: Object.values(neighbourhoodMap) };
};

const hardCodedLots: LotInterface[] = [
  // Neighbourhood: El Canton, Zone: 1
  {
    lotId: 'b1597fc2-cc63-4dd2-9f54-3fa5a19b8c37',
    lotLabel: '106',
    zoneId: '6d3f8c22-bbd6-4ed1-9cb2-2e0895a8df94',
    zoneLabel: '1',
    neighbourhoodId: 'e1c2406d-b1a5-441e-bd91-f6c5c8e6e0e7',
    neighbourhoodLabel: 'El Canton',
    lastMowingDate: new Date('2024-10-10'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },
  {
    lotId: '9c3f7d9e-60f3-4676-aab1-867ab9fa4bde',
    lotLabel: '101',
    zoneId: '6d3f8c22-bbd6-4ed1-9cb2-2e0895a8df94',
    zoneLabel: '1',
    neighbourhoodId: 'e1c2406d-b1a5-441e-bd91-f6c5c8e6e0e7',
    neighbourhoodLabel:
      'El Cantonaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    lastMowingDate: new Date('2024-10-06'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },
  {
    lotId: '7f3c6e12-6e1a-44d5-a2a7-9a4b6e8df5a1',
    lotLabel: '102',
    zoneId: '6d3f8c22-bbd6-4ed1-9cb2-2e0895a8df94',
    zoneLabel: '1',
    neighbourhoodId: 'e1c2406d-b1a5-441e-bd91-f6c5c8e6e0e7',
    neighbourhoodLabel:
      'El Cantonaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    lastMowingDate: new Date('2024-10-07'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },
  {
    lotId: '29c32fda-598d-4a2d-a1de-134c7e4bd7fa',
    lotLabel: '103',
    zoneId: '6d3f8c22-bbd6-4ed1-9cb2-2e0895a8df94',
    zoneLabel: '1',
    neighbourhoodId: 'e1c2406d-b1a5-441e-bd91-f6c5c8e6e0e7',
    neighbourhoodLabel:
      'El Cantonaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    lastMowingDate: new Date('2024-10-07'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },
  {
    lotId: 'c84a8d1b-391d-4a3a-929e-6bb4f517dca5',
    lotLabel: '104',
    zoneId: '6d3f8c22-bbd6-4ed1-9cb2-2e0895a8df94',
    zoneLabel: '1',
    neighbourhoodId: 'e1c2406d-b1a5-441e-bd91-f6c5c8e6e0e7',
    neighbourhoodLabel:
      'El Cantonaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    lastMowingDate: new Date('2024-10-08'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },
  {
    lotId: '471fa1d8-45b2-4b3f-b8f3-e9283cf3bb8c',
    lotLabel: '105',
    zoneId: '6d3f8c22-bbd6-4ed1-9cb2-2e0895a8df94',
    zoneLabel: '1',
    neighbourhoodId: 'e1c2406d-b1a5-441e-bd91-f6c5c8e6e0e7',
    neighbourhoodLabel:
      'El Cantonaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    lastMowingDate: new Date('2024-10-09'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },

  // Neighbourhood: El Canton, Zone: 2
  {
    lotId: 'a3f4db11-49d7-4d21-9a7e-4b7f85a1f376',
    lotLabel: '200',
    zoneId: 'bf5c9c35-4c9f-4664-9b8a-6a9bc1efc8e3',
    zoneLabel: '2',
    neighbourhoodId: 'e1c2406d-b1a5-441e-bd91-f6c5c8e6e0e7',
    neighbourhoodLabel:
      'El Cantonaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    lastMowingDate: new Date('2024-10-09'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },
  {
    lotId: '9d8f73a7-ded3-46c5-befa-caa5f8b8adfa',
    lotLabel: '201',
    zoneId: 'bf5c9c35-4c9f-4664-9b8a-6a9bc1efc8e3',
    zoneLabel: '2',
    neighbourhoodId: 'e1c2406d-b1a5-441e-bd91-f6c5c8e6e0e7',
    neighbourhoodLabel:
      'El Cantonaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    lastMowingDate: new Date('2024-10-10'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },
  {
    lotId: 'f5c6734a-04f0-4f3b-9bb0-b4a4d88faef9',
    lotLabel: '202',
    zoneId: 'bf5c9c35-4c9f-4664-9b8a-6a9bc1efc8e3',
    zoneLabel: '2',
    neighbourhoodId: 'e1c2406d-b1a5-441e-bd91-f6c5c8e6e0e7',
    neighbourhoodLabel:
      'El Cantonaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    lastMowingDate: new Date('2024-10-04'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },
  {
    lotId: 'f1185936-7696-4f44-9c6d-8a0ecce9e9c7',
    lotLabel: '202',
    zoneId: 'bf5c9c35-4c9f-4664-9b8a-6a9bc1efc8e3',
    zoneLabel: '2',
    neighbourhoodId: 'e1c2406d-b1a5-441e-bd91-f6c5c8e6e0e7',
    neighbourhoodLabel:
      'El Cantonaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    lastMowingDate: new Date('2024-10-25'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },

  // Neighbourhood: La Laguna, Zone: 3
  {
    lotId: 'e71829f1-7c6a-4d8e-bd4f-0981d640d1cf',
    lotLabel: '506',
    zoneId: '8cf9d5f0-995e-4c9a-854f-df5e5bb62c41',
    zoneLabel: '3',
    neighbourhoodId: '2f8bcb8a-1c2f-4dcb-a6b8-15f3d39e8ad9',
    neighbourhoodLabel: 'La Laguna',
    lastMowingDate: new Date('2024-10-02'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },
  {
    lotId: '7a153674-38c1-45d9-84b2-09b9b735d6f6',
    lotLabel: '507',
    zoneId: '8cf9d5f0-995e-4c9a-854f-df5e5bb62c41',
    zoneLabel: '3',
    neighbourhoodId: '2f8bcb8a-1c2f-4dcb-a6b8-15f3d39e8ad9',
    neighbourhoodLabel: 'La Laguna',
    lastMowingDate: new Date('2024-10-09'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },
  {
    lotId: 'b284b2e3-d169-4c2b-b1b1-4149821f5e8a',
    lotLabel: '508',
    zoneId: '8cf9d5f0-995e-4c9a-854f-df5e5bb62c41',
    zoneLabel: '3',
    neighbourhoodId: '2f8bcb8a-1c2f-4dcb-a6b8-15f3d39e8ad9',
    neighbourhoodLabel: 'La Laguna',
    lastMowingDate: new Date('2024-10-10'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },

  // Neighbourhood: El Tero, Zone: 7
  {
    lotId: 'b8bcbf3b-6e56-4b82-9cfa-30b4579c5165',
    lotLabel: '707',
    zoneId: '93d740f2-49eb-43b8-b87e-1b7c63c3f522',
    zoneLabel: '7',
    neighbourhoodId: '6a714a8b-0ac2-4b2b-8320-8b4c78c92f98',
    neighbourhoodLabel: 'El Tero',
    lastMowingDate: new Date('2024-10-08'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },
  {
    lotId: 'c4e7e2c7-4b78-4921-9f2c-33dcefdf7328',
    lotLabel: '708',
    zoneId: '93d740f2-49eb-43b8-b87e-1b7c63c3f522',
    zoneLabel: '7',
    neighbourhoodId: '6a714a8b-0ac2-4b2b-8320-8b4c78c92f98',
    neighbourhoodLabel: 'El Tero',
    lastMowingDate: new Date('2024-10-08'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },

  // Neighbourhood: El Naudir, Zone: 1
  {
    lotId: '27c0b89a-1d9d-44b9-b767-948d5f2c2309',
    lotLabel: '54',
    zoneId: '9e373c57-26a3-42ab-97a0-4235c6baf39f',
    zoneLabel: '1',
    neighbourhoodId: '33f8e2a5-f56e-4bfc-94b4-12e1a6cf8b24',
    neighbourhoodLabel: 'El Naudir',
    lastMowingDate: new Date('2024-10-10'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },
  {
    lotId: 'd66de7af-3d5e-4f77-a8f5-0bff6adf88c7',
    lotLabel: '55',
    zoneId: '9e373c57-26a3-42ab-97a0-4235c6baf39f',
    zoneLabel: '1',
    neighbourhoodId: '33f8e2a5-f56e-4bfc-94b4-12e1a6cf8b24',
    neighbourhoodLabel: 'El Naudir',
    lastMowingDate: new Date('2024-10-09'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },
  {
    lotId: 'fb5d1b54-fb2e-464c-9e3d-ec6b9e1d35f1',
    lotLabel: '56',
    zoneId: '9e373c57-26a3-42ab-97a0-4235c6baf39f',
    zoneLabel: '1',
    neighbourhoodId: '33f8e2a5-f56e-4bfc-94b4-12e1a6cf8b24',
    neighbourhoodLabel: 'El Naudir',
    lastMowingDate: new Date('2024-10-25'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },
  {
    lotId: 'bafb7a5c-8a25-4e79-8df2-124153c34371',
    lotLabel: '57',
    zoneId: '9e373c57-26a3-42ab-97a0-4235c6baf39f',
    zoneLabel: '1',
    neighbourhoodId: '33f8e2a5-f56e-4bfc-94b4-12e1a6cf8b24',
    neighbourhoodLabel: 'El Naudir',
    lastMowingDate: new Date('2024-10-24'),
    lotIsSelected: false,
    assignedTo: [],
    workgroupId: '1',
  },
];

const hardCodedWorkgroups: WorkgroupInterface[] = [
  {
    workgroupId: '1',
    name: 'Workgroup 1',
  },
];

const currentUser: UserInterface = {
  userId: 'user-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  workgroupAssignments: [
    {
      workgroupId: '1',
      role: 'PrimaryOwner',
      accessToAllLots: true,
      hasAcceptedPresenceInWorkgroup: true,
    },
  ],
};

const usersFromAllMyWorkgroups: UserInterface[] = [
  {
    userId: '1',
    firstName: 'Don',
    lastName: 'Corleoneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    email: 'cajardineria@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmm',
    workgroupAssignments: [
      {
        workgroupId: '1',
        role: 'Owner',
        accessToAllLots: true,
        hasAcceptedPresenceInWorkgroup: true,
      },
    ],
  },
  {
    userId: '2',
    firstName: 'pedro',
    lastName: 'Abigail',
    email: 'pabigail@gmail.com',
    workgroupAssignments: [
      {
        workgroupId: '1',
        role: 'Member',
        accessToAllLots: true,
        hasAcceptedPresenceInWorkgroup: true,
      },
    ],
  },
  {
    userId: '3',
    firstName: 'dibu',
    lastName: 'martinez',
    email: 'dibumartinez@gmail.com',
    workgroupAssignments: [
      {
        workgroupId: '1',
        role: 'Owner',
        accessToAllLots: true,
        hasAcceptedPresenceInWorkgroup: true,
      },
    ],
  },
  {
    userId: '4',
    firstName: 'di',
    lastName: 'bu',
    email: 'dibu@gmail.com',
    workgroupAssignments: [
      {
        workgroupId: '1',
        role: 'PrimaryOwner',
        accessToAllLots: true,
        hasAcceptedPresenceInWorkgroup: true,
      },
    ],
  },
  {
    userId: '5',
    firstName: 'pablo',
    lastName: 'diaz',
    email: 'pablotski@gmail.com',
    workgroupAssignments: [
      {
        workgroupId: '1',
        role: 'Manager',
        accessToAllLots: true,
        hasAcceptedPresenceInWorkgroup: true,
      },
    ],
  },
  {
    userId: '6',
    firstName: 'Juan',
    lastName: 'Nomiente',
    email: 'juansimiente@gmail.com',
    workgroupAssignments: [
      {
        workgroupId: '1',
        role: 'Member',
        accessToAllLots: true,
        hasAcceptedPresenceInWorkgroup: true,
      },
    ],
  },
  {
    userId: '7',
    firstName: 'torta',
    lastName: 'frita',
    email: 'tortafrita@gmail.com',
    workgroupAssignments: [
      {
        workgroupId: '1',
        role: 'Member',
        accessToAllLots: true,
        hasAcceptedPresenceInWorkgroup: true,
      },
    ],
  },
];

const getMyLots = () => {
  return hardCodedLots;
};

const getMyWorgroups = () => {
  return hardCodedWorkgroups;
};

const getMyUser = () => {
  return currentUser;
};

const getUsersFromAllMyWorkgroups = () => {
  return usersFromAllMyWorkgroups;
};

export default {
  getMyLots,
  getMyWorgroups,
  getMyUser,
  getUsersFromAllMyWorkgroups,
  getNeighbourhoodZoneData,
};
