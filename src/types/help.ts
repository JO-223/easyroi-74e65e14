
export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  links?: {
    text: string;
    url: string;
  }[];
}

export interface HelpCategory {
  id: string;
  title: string;
  icon?: string;
  articles: HelpArticle[];
}
