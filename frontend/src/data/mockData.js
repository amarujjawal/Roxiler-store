export const users = [
  { id: 1, name: 'Ava Patel', email: 'admin@demo.com', address: '12 Harbor Lane, Boston', role: 'ADMIN', password: 'Admin@123' },
  { id: 2, name: 'John Carter', email: 'user@demo.com', address: '54 Maple Street, Seattle', role: 'USER', password: 'User@123' },
  { id: 3, name: 'Maria Gomez', email: 'owner@demo.com', address: '88 Market Blvd, Austin', role: 'OWNER', password: 'Owner@123' },
  { id: 4, name: 'Daniel Lee', email: 'daniel.lee@example.com', address: '7 Cedar Avenue, Denver', role: 'USER' },
  { id: 5, name: 'Priya Shah', email: 'priya.shah@example.com', address: '49 River Road, Chicago', role: 'USER' },
  { id: 6, name: 'Liam Nguyen', email: 'liam.nguyen@example.com', address: '3 Pine Circle, Miami', role: 'OWNER' },
  { id: 7, name: 'Sofia Davis', email: 'sofia.davis@example.com', address: '19 North Ave, Portland', role: 'USER' },
  { id: 8, name: 'Ethan Brooks', email: 'ethan.brooks@example.com', address: '91 West End, Atlanta', role: 'USER' },
  { id: 9, name: 'Nina Roberts', email: 'nina.roberts@example.com', address: '60 Stone Street, Phoenix', role: 'OWNER' },
  { id: 10, name: 'Noah Kim', email: 'noah.kim@example.com', address: '26 Birch Lane, San Diego', role: 'USER' },
  { id: 11, name: 'Olivia Turner', email: 'olivia.turner@example.com', address: '77 Lake View, Nashville', role: 'USER' },
  { id: 12, name: 'Henry Scott', email: 'henry.scott@example.com', address: '15 Willow Park, Dallas', role: 'OWNER' },
  { id: 13, name: 'Emma Moore', email: 'emma.moore@example.com', address: '31 Oak Terrace, Orlando', role: 'USER' },
  { id: 14, name: 'Lucas Evans', email: 'lucas.evans@example.com', address: '12 Fifth Street, Las Vegas', role: 'USER' },
  { id: 15, name: 'Mila Lewis', email: 'mila.lewis@example.com', address: '48 Garden Row, Charlotte', role: 'OWNER' },
  { id: 16, name: 'James Walker', email: 'james.walker@example.com', address: '63 Hill Crest, Raleigh', role: 'USER' },
];

export const stores = [
  { id: 1, name: 'Harbor & Hearth', email: 'hello@harborhearth.com', address: '200 Bay Street, Boston', ownerId: 3, rating: 4.6 },
  { id: 2, name: 'Summit Street Cafe', email: 'hello@summitstreetcafe.com', address: '88 Pine Plaza, Seattle', ownerId: 6, rating: 4.8 },
  { id: 3, name: 'Velvet Bean', email: 'hello@velvetbean.com', address: '44 Market Road, Austin', ownerId: 9, rating: 4.4 },
  { id: 4, name: 'North Loop Market', email: 'hello@northloopmarket.com', address: '18 Union Avenue, Chicago', ownerId: 12, rating: 4.2 },
  { id: 5, name: 'Blue Lantern', email: 'hello@bluelantern.com', address: '71 Harbor View, Miami', ownerId: 15, rating: 4.9 },
  { id: 6, name: 'Luma Pantry', email: 'hello@lumapantry.com', address: '22 Conger Way, Denver', ownerId: 6, rating: 4.5 },
  { id: 7, name: 'Clay & Co.', email: 'hello@clayco.com', address: '16 Mill Creek, Phoenix', ownerId: 9, rating: 4.1 },
  { id: 8, name: 'Cedar Grove', email: 'hello@cedargrove.com', address: '19 Willow Square, Portland', ownerId: 12, rating: 4.7 },
  { id: 9, name: 'The Green Table', email: 'hello@greentable.com', address: '10 Maple Terrace, Atlanta', ownerId: 15, rating: 4.3 },
  { id: 10, name: 'Aster Lane', email: 'hello@asterlane.com', address: '54 Glenn Street, Dallas', ownerId: 3, rating: 4.8 },
  { id: 11, name: 'Oak & Ember', email: 'hello@oakember.com', address: '13 Riverside Drive, Las Vegas', ownerId: 6, rating: 4.6 },
  { id: 12, name: 'Sage & Stone', email: 'hello@sageandstone.com', address: '29 Broad Avenue, Raleigh', ownerId: 9, rating: 4.4 },
];

export const storeRatings = [
  { id: 1, storeId: 1, userId: 2, rating: 5, date: '2026-09-18T10:00:00.000Z' },
  { id: 2, storeId: 1, userId: 4, rating: 4, date: '2026-09-21T12:00:00.000Z' },
  { id: 3, storeId: 1, userId: 5, rating: 5, date: '2026-09-22T09:15:00.000Z' },
  { id: 4, storeId: 1, userId: 7, rating: 4, date: '2026-09-24T14:20:00.000Z' },
  { id: 5, storeId: 2, userId: 2, rating: 5, date: '2026-09-19T11:15:00.000Z' },
  { id: 6, storeId: 2, userId: 8, rating: 4, date: '2026-09-20T19:00:00.000Z' },
  { id: 7, storeId: 2, userId: 10, rating: 5, date: '2026-09-25T08:45:00.000Z' },
  { id: 8, storeId: 3, userId: 4, rating: 4, date: '2026-09-23T17:20:00.000Z' },
  { id: 9, storeId: 3, userId: 11, rating: 5, date: '2026-09-26T13:30:00.000Z' },
  { id: 10, storeId: 4, userId: 2, rating: 3, date: '2026-09-27T09:20:00.000Z' },
  { id: 11, storeId: 4, userId: 13, rating: 4, date: '2026-09-28T15:05:00.000Z' },
  { id: 12, storeId: 5, userId: 5, rating: 5, date: '2026-09-20T10:00:00.000Z' },
  { id: 13, storeId: 5, userId: 14, rating: 5, date: '2026-09-21T18:15:00.000Z' },
  { id: 14, storeId: 6, userId: 16, rating: 4, date: '2026-09-22T09:40:00.000Z' },
  { id: 15, storeId: 7, userId: 7, rating: 4, date: '2026-09-25T12:35:00.000Z' },
  { id: 16, storeId: 8, userId: 13, rating: 5, date: '2026-09-26T08:50:00.000Z' },
  { id: 17, storeId: 9, userId: 2, rating: 4, date: '2026-09-27T11:10:00.000Z' },
  { id: 18, storeId: 10, userId: 8, rating: 5, date: '2026-09-19T16:25:00.000Z' },
  { id: 19, storeId: 11, userId: 4, rating: 4, date: '2026-09-28T14:50:00.000Z' },
  { id: 20, storeId: 12, userId: 10, rating: 3, date: '2026-09-23T11:35:00.000Z' },
];

export const getUserById = (userId) => users.find((user) => user.id === userId);

export const getStoreByOwnerId = (ownerId) => stores.find((store) => store.ownerId === ownerId);

export const getStoreRatingsForOwner = (ownerId) => {
  const store = getStoreByOwnerId(ownerId);
  if (!store) return [];

  return storeRatings
    .filter((entry) => entry.storeId === store.id)
    .map((entry) => ({
      ...entry,
      user: getUserById(entry.userId),
    }));
};

export const getAverageRating = (storeId) => {
  const filtered = storeRatings.filter((entry) => entry.storeId === storeId);
  if (!filtered.length) return 0;
  const sum = filtered.reduce((total, item) => total + item.rating, 0);
  return Number((sum / filtered.length).toFixed(1));
};

export const getStoreWithRating = (store) => ({
  ...store,
  averageRating: getAverageRating(store.id),
});

export const mockStats = {
  totalUsers: users.length,
  totalStores: stores.length,
  totalRatings: storeRatings.length,
};
