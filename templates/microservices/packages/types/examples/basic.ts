import { User, Order } from '@moonrepo/types';

const user: User = {
  id: '1',
  name: 'John Doe'
};

const order: Order = {
  id: '1',
  userId: user.id,
  items: []
};

console.log('Types imported:', { user, order });
