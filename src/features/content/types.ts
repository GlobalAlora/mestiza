// Fase 3-5: content_blocks editables (Home, Historia)

export type ContentBlockKey = 'home_hero' | 'home_featured' | 'home_story' | 'historia_main';

export type ContentBlock = {
  key: ContentBlockKey;
  content: Record<string, unknown>;
  is_published: boolean;
  updated_at: string;
};
