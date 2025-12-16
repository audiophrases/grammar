export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | string;

export interface GrammarPoint {
  point_id: string;
  title_en?: string;
  title_ca?: string;
  cefr_level?: CEFRLevel;
  sort_order?: number;
  thread_id?: string;
  tags?: string[];
  explanation_en?: string;
  explanation_ca?: string;
  form_pattern?: string;
  common_errors?: string;
  examples_en?: string[];
  examples_ca?: string[];
  parent_point_id?: string;
  related_point_ids?: string[];
  next_point_id?: string;
  media_image?: string;
  media_audio?: string;
  updated_at?: string;
}

export type ActivityType =
  | 'MCQ'
  | 'FILL_BLANK'
  | 'ERROR_CORRECTION'
  | 'TRANSLATE_CA_EN'
  | 'TRANSLATE_EN_CA'
  | 'WORD_ORDER'
  | string;

export interface PracticeItem {
  item_id: string;
  point_id: string;
  activity_type: ActivityType;
  prompt_en?: string;
  prompt_ca?: string;
  acceptable_answers?: string[];
  options?: Record<string, string>;
  hint?: string;
  feedback?: string;
  sort_order?: number;
  tags?: string[];
  media_image?: string;
  media_audio?: string;
  updated_at?: string;
}

export interface DataBundle {
  fetchedAt: number;
  grammarPoints: GrammarPoint[];
  practiceItems: PracticeItem[];
}
