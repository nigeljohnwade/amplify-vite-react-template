import { useOutletContext } from 'react-router';

import type { Schema } from '../../amplify/data/resource.ts';

export type PlanContext = {
    plans: Array<Schema['Plan']['type']>;
    // Current map center, used as the location to save against a plan.
    center: [number, number];
    // Recenter the map; pages call this on mount to focus the relevant area.
    flyTo: (coords: [number, number], zoom?: number) => void;
};

export const usePlanContext = () => useOutletContext<PlanContext>();
