/* eslint-disable */

import { KeystoneContext } from '@keystone-next/types';
import { Session } from '../types';
import { CartItemCreateInput } from '../.keystone/schema-types';

async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  // 1. Query the current user
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to dod this!');
  }
  // 2. Query the current users cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    resolveFields: 'id,quantity',
  });

  const [exisitingCartItem] = allCartItems;
  if (exisitingCartItem) {
    console.log(exisitingCartItem);
    console.log(`
    Ther are already ${exisitingCartItem.quantity}, increment by one
    `);
    // 3. See if the current item is in there
    // 4 if it is, increment by one
    return await context.lists.CartItem.updateOne({
      id: exisitingCartItem.id,
      data: { quantity: exisitingCartItem.quantity + 1 },
    });
  }

  // 4 if it isn't create a new cart item
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
    },
  });
}

export default addToCart;
