import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-03-04',
  /* The CDN endpoint answers with
       cache-control: private, max-age=60, stale-while-revalidate=15
     so for up to a minute after a write, reads (including the browser's own
     cache) can still serve the pre-write state - that was the lag after
     saving, commenting or uploading. Measured on this dataset the fresh
     endpoint costs ~17ms more per query, which is a fair trade for never
     showing stale data. */
  useCdn: false,
  token: process.env.REACT_APP_SANITY_TOKEN,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
