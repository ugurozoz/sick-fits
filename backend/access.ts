import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';
// At it's simplest,

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPErmissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return session?.data.role?.[permission];
    },
  ])
);

// Permissions check if someone meets a criteria
export const permissions = {
  ...generatedPErmissions,
};

// Rule based function
// Rules can return a boolean or filter which limits which products they can CRUD.
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. If not do yhey own this item
    return { user: { id: session.itemId } };
  },

  canReadProducts({ session }: ListAccessArgs) {
    if (permissions.canManageProducts({ session })) {
      return true; // Read everything
    }
    // Tehey should only see available products
    return { status: 'AVAILABLE' };
  },
};
