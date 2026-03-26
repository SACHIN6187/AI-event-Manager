import {v} from 'convex/values';

import {internal} from './_generated/api';
import {mutation, query} from './_generated/server';

//
// ✅ STORE USER (CREATE / UPDATE)
//
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const tokenIdentifier = identity.subject;

    // Check if user already exists
    const existingUser =
        await ctx.db.query('users')
            .withIndex(
                'by_token', (q) => q.eq('tokenIdentifier', tokenIdentifier))
            .unique();

    if (existingUser) {
      const updates = {};

      if (existingUser.name !== identity.name) {
        updates.name = identity.name ?? 'Anonymous';
      }

      if (existingUser.email !== identity.email) {
        updates.email = identity.email ?? '';
      }

      if (existingUser.imageUrl !== identity.pictureUrl) {
        updates.imageUrl = identity.pictureUrl;
      }

      if (Object.keys(updates).length > 0) {
        updates.updatedAt = Date.now();
        await ctx.db.patch(existingUser._id, updates);
      }

      return existingUser._id;
    }

    // ✅ Create new user
    return await ctx.db.insert('users', {
      email: identity.email ?? '',
      tokenIdentifier,
      name: identity.name ?? 'Anonymous',
      imageUrl: identity.pictureUrl,
      hasCompletedOnboarding: false,
      freeEventsCreated: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

//
// ✅ GET CURRENT USER (SAFE - NO CRASH)
//
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const tokenIdentifier = identity.subject;

    const user =
        await ctx.db.query('users')
            .withIndex(
                'by_token', (q) => q.eq('tokenIdentifier', tokenIdentifier))
            .unique();

    return user ?? null;
  },
});

//
// ✅ COMPLETE ONBOARDING
//
export const completeOnboarding = mutation({
  args: {
    location: v.object({
      city: v.string(),
      state: v.optional(v.string()),
      country: v.string(),
    }),
    interests: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error('Not authenticated');

    const tokenIdentifier = identity.subject;

    const user =
        await ctx.db.query('users')
            .withIndex(
                'by_token', (q) => q.eq('tokenIdentifier', tokenIdentifier))
            .unique();

    if (!user) {
      throw new Error('User not found (store() not called)');
    }

    await ctx.db.patch(user._id, {
      location: args.location,
      interests: args.interests,
      hasCompletedOnboarding: true,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

export const updateUserProStatus = mutation({
  args: {
    hasPro: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user =
        await ctx.db.query('users')
            .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
            .unique();

    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, {
      hasPro: args.hasPro,
    });
  },
});