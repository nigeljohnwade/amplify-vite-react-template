import { useOutletContext } from 'react-router';

import type { Schema } from '../../amplify/data/resource.ts';

export type Plan = {
    category: {
        displayName: string;
        value: string;
    }
    categoryId: string
    content: string
    date: string
    id: string
    isDone: boolean
    location: {
        lat: number
        long: number
    }
    place: string
    priority: string
    status: string
    time: string
    title: string
}
export type PlanContext = {
    plans: Plan[]
    categories: Array<Schema['Category']['type']>
    // Current map center, used as the location to save against a plan.
    center: [number, number];
    // Recenter the map; pages call this on mount to focus the relevant area.
    flyTo: (coords: [number, number], zoom?: number) => void;
};

export const usePlanContext = () => useOutletContext<PlanContext>();
