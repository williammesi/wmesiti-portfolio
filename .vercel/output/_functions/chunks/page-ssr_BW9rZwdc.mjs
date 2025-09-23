import { createClient } from '@sanity/client';

const sanityClient = createClient(
            {"apiVersion":"v2023-08-24","projectId":"9bdbnjzy","dataset":"production","useCdn":false}
          );

globalThis.sanityClient = sanityClient;
