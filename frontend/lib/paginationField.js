import { mergeDeepArray } from '@apollo/client/utilities';
import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      const { skip, first } = args;

      // Read the number o f items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // If there are items AND there arent enough items
      // to satisfy how many were requested
      // AND we are on the last page
      // Then just send it
      if (items.length && items.length !== first && page == pages) {
        return items;
      }

      if (items.length !== first) {
        // WE dont have any items we must fetch them
        return false;
      }

      // If there are items  return tehm from teh cache
      if (items.length) {
        console.log(
          `There are ${items.length} items in the cache! Gonna send them to apollo`
        );

        return items;
      }

      return false; // Fallback to network
      // First thing it does it asks the read function for those items

      // We can either do on of two things

      // First thing we can do is return the items because they are already in the cache

      // The other thing we can do is to return a false from here, (network request)
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      console.log(`Merging items from the network ${incoming.length}`);
      console.log('sadasd', incoming);
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // We return the meged items from the cache
      return merged;
    },
  };
}
