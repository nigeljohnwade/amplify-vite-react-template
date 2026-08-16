import { createContext } from 'react';
import { DEFAULT_LIST_VIEW } from '../configuration/constants.ts';

const UiContext = createContext<{
    planView: 'list' | 'tile',
    setPlanView: (planView: 'list' | 'tile') => void,
}>({
    planView: DEFAULT_LIST_VIEW,
    setPlanView: () => {
    }
});

export default UiContext;