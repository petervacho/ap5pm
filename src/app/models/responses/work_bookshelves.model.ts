// Response from /works/[id]/bookshelves.json endpoint
export interface WorkBookshelvesResponse {
  counts: Counts;
}

export interface Counts {
  want_to_read: number;
  currently_reading: number;
  already_read: number;
}
