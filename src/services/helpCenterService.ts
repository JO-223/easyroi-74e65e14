import { supabase } from "@/integrations/supabase/client";

// Add the missing HelpArticle type
export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  popularity: number;
  lastUpdated: string;
}

/**
 * Fetches all help articles from the database.
 * @returns {Promise<HelpArticle[]>} - A promise that resolves to an array of HelpArticle objects.
 */
export const fetchHelpArticles = async (): Promise<HelpArticle[]> => {
  try {
    const { data, error } = await supabase
      .from('help_articles')
      .select('*')
      .order('popularity', { ascending: false });

    if (error) {
      console.error("Error fetching help articles:", error);
      return [];
    }

    return data as HelpArticle[];
  } catch (error) {
    console.error("Unexpected error fetching help articles:", error);
    return [];
  }
};

/**
 * Fetches a single help article by its ID.
 * @param {string} id - The ID of the help article to fetch.
 * @returns {Promise<HelpArticle | null>} - A promise that resolves to a HelpArticle object or null if not found.
 */
export const fetchHelpArticleById = async (id: string): Promise<HelpArticle | null> => {
  try {
    const { data, error } = await supabase
      .from('help_articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching help article with ID ${id}:`, error);
      return null;
    }

    return data as HelpArticle;
  } catch (error) {
    console.error(`Unexpected error fetching help article with ID ${id}:`, error);
    return null;
  }
};

/**
 * Searches help articles based on a query string.
 * @param {string} query - The search query.
 * @returns {Promise<HelpArticle[]>} - A promise that resolves to an array of HelpArticle objects that match the query.
 */
export const searchHelpArticles = async (query: string): Promise<HelpArticle[]> => {
  try {
    const { data, error } = await supabase
      .from('help_articles')
      .select('*')
      .ilike('title', `%${query}%`)
      .order('popularity', { ascending: false });

    if (error) {
      console.error(`Error searching help articles with query ${query}:`, error);
      return [];
    }

    return data as HelpArticle[];
  } catch (error) {
    console.error(`Unexpected error searching help articles with query ${query}:`, error);
    return [];
  }
};

/**
 * Fetches help articles by category.
 * @param {string} category - The category to filter help articles by.
 * @returns {Promise<HelpArticle[]>} - A promise that resolves to an array of HelpArticle objects that belong to the specified category.
 */
export const fetchHelpArticlesByCategory = async (category: string): Promise<HelpArticle[]> => {
  try {
    const { data, error } = await supabase
      .from('help_articles')
      .select('*')
      .eq('category', category)
      .order('popularity', { ascending: false });

    if (error) {
      console.error(`Error fetching help articles for category ${category}:`, error);
      return [];
    }

    return data as HelpArticle[];
  } catch (error) {
    console.error(`Unexpected error fetching help articles for category ${category}:`, error);
    return [];
  }
};
