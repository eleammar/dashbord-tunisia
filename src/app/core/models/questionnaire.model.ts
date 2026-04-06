// ═══════════════════════════════════════════════════════════
//  QUESTIONNAIRE MODEL — Explorer Tunisia Admin
//  Pont entre l'utilisateur et le moteur de recommandation
// ═══════════════════════════════════════════════════════════

import { Tag } from './tag.model';

export type QuestionType = 'single' | 'multiple';

export type QuestionnaireStatus = 'draft' | 'published' | 'archived';

// ── Choice (avec tags = pont vers le moteur IA) ────────────
export interface Choice {
  id: string;
  questionId: string;
  text: string;
  textAr?: string;
  icon?: string;              // Emoji
  coverImage?: string;
  tags: Tag[];               // ← PONT CLEF entre choix et moteur IA
  weight: number;            // Importance du choix dans le scoring (1-10)
  order: number;
  isActive: boolean;
}

export interface CreateChoiceDto {
  questionId: string;
  text: string;
  textAr?: string;
  icon?: string;
  coverImage?: string;
  tagIds: string[];
  weight: number;
  order: number;
}

export interface UpdateChoiceDto extends Partial<CreateChoiceDto> {
  isActive?: boolean;
}

// ── Question ───────────────────────────────────────────────
export interface Question {
  id: string;
  questionnaireId: string;
  text: string;
  textAr?: string;
  subtitle?: string;
  type: QuestionType;
  icon?: string;
  coverImage?: string;
  order: number;
  isRequired: boolean;
  choices: Choice[];
  isActive: boolean;
}

export interface CreateQuestionDto {
  questionnaireId: string;
  text: string;
  textAr?: string;
  subtitle?: string;
  type: QuestionType;
  icon?: string;
  coverImage?: string;
  order: number;
  isRequired?: boolean;
}

export interface UpdateQuestionDto extends Partial<CreateQuestionDto> {
  isActive?: boolean;
}

// ── Questionnaire ──────────────────────────────────────────
export interface Questionnaire {
  id: string;
  title: string;
  titleAr?: string;
  description?: string;
  status: QuestionnaireStatus;
  questions: Question[];
  estimatedDuration: number;  // en minutes
  completionCount: number;    // Nombre de fois complété
  version: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface CreateQuestionnaireDto {
  title: string;
  titleAr?: string;
  description?: string;
  estimatedDuration?: number;
}

export interface UpdateQuestionnaireDto extends Partial<CreateQuestionnaireDto> {
  status?: QuestionnaireStatus;
}

// ── Mock Data ──────────────────────────────────────────────
export const MOCK_QUESTIONNAIRE: Questionnaire = {
  id: 'q-001',
  title: "Découvrez votre Tunisie idéale",
  titleAr: "اكتشف تونس المثالية لك",
  description: "Répondez à quelques questions pour personnaliser votre voyage.",
  status: 'published',
  estimatedDuration: 3,
  completionCount: 4820,
  version: 3,
  questions: [
    {
      id: 'ques-001',
      questionnaireId: 'q-001',
      text: "Quel type de paysage vous attire le plus ?",
      textAr: "ما نوع المناظر الطبيعية التي تستقطبك أكثر؟",
      type: 'single',
      icon: '🌅',
      order: 1,
      isRequired: true,
      isActive: true,
      choices: [
        {
          id: 'ch-001', questionId: 'ques-001',
          text: 'Les plages et la mer', textAr: 'الشواطئ والبحر',
          icon: '🏖️', tags: [], weight: 8, order: 1, isActive: true,
        },
        {
          id: 'ch-002', questionId: 'ques-001',
          text: 'Le désert et les dunes', textAr: 'الصحراء والكثبان',
          icon: '🐪', tags: [], weight: 9, order: 2, isActive: true,
        },
        {
          id: 'ch-003', questionId: 'ques-001',
          text: 'Les montagnes et forêts', textAr: 'الجبال والغابات',
          icon: '🌿', tags: [], weight: 7, order: 3, isActive: true,
        },
        {
          id: 'ch-004', questionId: 'ques-001',
          text: 'Les villes et la culture', textAr: 'المدن والثقافة',
          icon: '🏛️', tags: [], weight: 7, order: 4, isActive: true,
        },
      ],
    },
    {
      id: 'ques-002',
      questionnaireId: 'q-001',
      text: "Quel style de voyage vous correspond ?",
      type: 'multiple',
      icon: '🎒',
      order: 2,
      isRequired: true,
      isActive: true,
      choices: [
        {
          id: 'ch-005', questionId: 'ques-002',
          text: 'Aventure & Sport', icon: '🧗', tags: [], weight: 9, order: 1, isActive: true,
        },
        {
          id: 'ch-006', questionId: 'ques-002',
          text: 'Détente & Bien-être', icon: '🧘', tags: [], weight: 7, order: 2, isActive: true,
        },
        {
          id: 'ch-007', questionId: 'ques-002',
          text: 'Culture & Histoire', icon: '🏺', tags: [], weight: 8, order: 3, isActive: true,
        },
        {
          id: 'ch-008', questionId: 'ques-002',
          text: 'Gastronomie', icon: '🍽️', tags: [], weight: 6, order: 4, isActive: true,
        },
      ],
    },
  ],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-03-01'),
  publishedAt: new Date('2024-02-01'),
};