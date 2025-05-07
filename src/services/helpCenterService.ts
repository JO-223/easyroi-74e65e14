
import { supabase } from "@/integrations/supabase/client";
import { HelpCategory, HelpArticle } from "@/types/help";

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
 * Fetches all help categories with their articles.
 * @returns {Promise<HelpCategory[]>} - A promise that resolves to an array of HelpCategory objects.
 */
export const fetchHelpCategories = async (): Promise<HelpCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('help_categories')
      .select('id, title, icon');

    if (error) {
      console.error("Error fetching help categories:", error);
      return [];
    }

    // For each category, fetch its articles
    const categoriesWithArticles = await Promise.all(
      (data || []).map(async (category) => {
        const articles = await fetchHelpArticlesByCategory(category.id);
        return {
          id: category.id,
          title: category.title,
          icon: category.icon,
          articles
        } as HelpCategory;
      })
    );

    return categoriesWithArticles;
  } catch (error) {
    console.error("Unexpected error fetching help categories:", error);
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
