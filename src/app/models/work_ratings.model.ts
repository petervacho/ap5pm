// TODO: Needs more requests to catch optionals

import { WorkSearchDataDetails } from './work_search.model';

export interface WorkRatingsData {
  summary: Summary;
  counts: Counts;
}

export interface Counts {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
}

export interface Summary {
  average: number;
  count: number;
  sortable: number;
}

// Obtain edition ratings data from the work search data details.
// The search data contains this information, however it's in a different
// format, this takes it and converts it to this nicer to work with format
export function buildRatingsDataFromSearch(
  data: WorkSearchDataDetails,
): WorkRatingsData | null {
  // I'm very aware how horrible this kind of check is, however, there's
  // just no other good way to handle this. Yeah, great API design....
  if (
    data.ratings_average &&
    data.ratings_count &&
    data.ratings_sortable &&
    data.ratings_count_1 &&
    data.ratings_count_2 &&
    data.ratings_count_3 &&
    data.ratings_count_4 &&
    data.ratings_count_5
  ) {
    return {
      summary: {
        average: data.ratings_average,
        count: data.ratings_count,
        sortable: data.ratings_sortable,
      },
      counts: {
        '1': data.ratings_count_1,
        '2': data.ratings_count_2,
        '3': data.ratings_count_3,
        '4': data.ratings_count_4,
        '5': data.ratings_count_5,
      },
    };
  }
  return null;
}
