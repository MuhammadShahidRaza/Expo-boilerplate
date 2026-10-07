import type { PayloadAction } from '@reduxjs/toolkit';

import { countryByCode } from '@/data/catalog';

import type { WorldState } from './state';

export const setupReducers = {
  setCountry(state: WorldState, action: PayloadAction<string>) {
    const country = countryByCode(action.payload);
    state.countryCode = action.payload;
    state.stateName = null;
    state.stateSkipped = false;
    if (!country) return;
    const existing = state.communities.find((item) => item.code === country.code);
    state.communities = state.communities.map((item) => ({ ...item, active: false }));
    if (existing) {
      existing.active = true;
    } else {
      state.communities.unshift({
        id: country.code,
        code: country.code,
        name: country.name,
        active: true,
      });
    }
  },
  setStateName(state: WorldState, action: PayloadAction<string>) {
    state.stateName = action.payload;
    state.stateSkipped = false;
    const active = state.communities.find((item) => item.active);
    if (active) active.state = action.payload;
  },
  skipState(state: WorldState) {
    state.stateSkipped = true;
    state.stateName = null;
  },
  markLanguagePicked(state: WorldState) {
    state.languagePicked = true;
  },
  markIntroSeen(state: WorldState) {
    state.introSeen = true;
  },
  toggleOrigin(state: WorldState, action: PayloadAction<string>) {
    if (state.originIds.includes(action.payload)) {
      state.originIds = state.originIds.filter((id) => id !== action.payload);
      if (state.primaryOriginId === action.payload) state.primaryOriginId = state.originIds[0] ?? null;
      return;
    }
    if (state.originIds.length >= 5) return;
    state.originIds.push(action.payload);
  },
  setPrimaryOrigin(state: WorldState, action: PayloadAction<string>) {
    state.primaryOriginId = action.payload;
  },
  setActiveCommunity(state: WorldState, action: PayloadAction<string>) {
    state.communities = state.communities.map((item) => ({ ...item, active: item.id === action.payload }));
    const active = state.communities.find((item) => item.id === action.payload);
    if (active) {
      state.countryCode = active.code;
      state.stateName = active.state ?? null;
      state.activeChapter = active.state || active.name;
    }
  },
  addCommunity(state: WorldState, action: PayloadAction<string>) {
    const country = countryByCode(action.payload);
    if (!country || state.communities.some((item) => item.code === country.code)) return;
    state.communities.push({ id: country.code, code: country.code, name: country.name, active: false });
  },
  removeCommunity(state: WorldState, action: PayloadAction<string>) {
    const target = state.communities.find((item) => item.id === action.payload);
    if (!target || target.active) return;
    state.communities = state.communities.filter((item) => item.id !== action.payload);
  },
};
