import { UserBudgetRole } from '@/types/dataTypes';
import {
  createNewBudgetMembership,
  getBudgetMembershipsByUserId,
  updateBudgetMembershipById,
} from './budgetMemberships';
import { createNewBudget, getBudgetById, getBudgetsByOwnerId } from './budgets';
import { createUserPreference, getUserPreference, updateUserPreference } from './userPreferences';

export async function ensureUserBootstrapData(userId: string) {
  // 1. Load the user's existing budgets and memberships.
  const [ownedBudgets, memberships, existingPreference] = await Promise.all([
    getBudgetsByOwnerId(userId),
    getBudgetMembershipsByUserId(userId),
    getUserPreference(userId),
  ]);

  // 2. Reuse an existing Personal Budget, if available.
  // Otherwise, reuse an existing owned budget. This also avoids
  // creating a duplicate if the original budget was renamed.
  // Only create a budget if the user owns none.
  let initialBudget =
    ownedBudgets.find((budget) => budget.name === 'Personal Budget') ?? ownedBudgets[0];

  if (!initialBudget) {
    const now = new Date().toISOString();

    initialBudget = await createNewBudget({
      name: 'Personal Budget',
      description: 'Your personal budget',
      ownerId: userId,
      startDate: now,
      endDate: null,
      currency: 'INR',
      limitAmount: null,
      isShareable: false,
    });
  }

  // 3. Ensure the user has an owner membership for the
  // initial budget.
  const ensureOwnerMembership = async (budgetId: string) => {
    const membership = memberships.find((item) => item.budgetId === budgetId);

    if (!membership) {
      const created = await createNewBudgetMembership({
        budgetId,
        userId,
        role: UserBudgetRole.owner,
      });

      if (!created) {
        throw new Error('Unable to create budget membership.');
      }

      memberships.push(created);
      return;
    }

    if (membership.role !== UserBudgetRole.owner) {
      const updated = await updateBudgetMembershipById(membership.id, {
        role: UserBudgetRole.owner,
      });

      if (!updated) {
        throw new Error('Unable to repair budget membership.');
      }
    }
  };

  await ensureOwnerMembership(initialBudget.id);

  // 4. Preserve a valid existing preference. If it points to
  // a missing or inaccessible budget, fall back to the initial
  // budget instead.
  let defaultBudgetId = initialBudget.id;

  if (existingPreference) {
    const preferredBudget = await getBudgetById(existingPreference.defaultBudgetId);

    const canAccessPreferredBudget =
      preferredBudget !== null &&
      (preferredBudget.ownerId === userId ||
        memberships.some((item) => item.budgetId === preferredBudget.id));

    if (canAccessPreferredBudget) {
      defaultBudgetId = preferredBudget.id;

      // An owned budget should also have its owner membership.
      if (preferredBudget.ownerId === userId) {
        await ensureOwnerMembership(preferredBudget.id);
      }
    }

    if (existingPreference.defaultBudgetId !== defaultBudgetId) {
      const updated = await updateUserPreference(userId, {
        defaultBudgetId,
      });

      if (!updated) {
        throw new Error('Unable to repair user preferences.');
      }
    }
  } else {
    const created = await createUserPreference({
      userId,
      defaultBudgetId,
    });

    if (!created) {
      throw new Error('Unable to create user preferences.');
    }
  }

  // Return the resolved data for the bootstrap coordinator.
  return {
    initialBudget,
    defaultBudgetId,
  };
}
