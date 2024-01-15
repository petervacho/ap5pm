// Response from /works/[id]/ratings.json endpoint
export interface WorkRatingsResponse {
  summary: Summary;
  counts: Counts;
}

// No optional keys here, it'll just be 0 if unknown
export interface Counts {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
}

export interface Summary {
  average?: number | null; // Can both be missing, or literally 'null' for some reason
  count: number; // Not optional, will just be 0 if unknown
  sortable?: number;
}
