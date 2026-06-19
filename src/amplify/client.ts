import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';

import outputs from '../../amplify_outputs.json';
import type { Schema } from '../../amplify/data/resource.ts';

// Configure here so the data client below is created after configuration,
// regardless of module import order.
Amplify.configure(outputs);

export const client = generateClient<Schema>();
