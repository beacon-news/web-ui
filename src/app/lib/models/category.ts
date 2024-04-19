export interface CategoryResults {
  total: number;
  results: CategoryResult[];
};

// same as ArticleCategory...
export interface CategoryResult {
  id: string;
  name: string;
};