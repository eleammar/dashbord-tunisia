// src/app/models/onboarding.models.ts
export type OptionType = 'image' | 'icon' | 'text';

export interface OnboardingOption {
  id: string;               // ex: 'coast'
  title: string;            // ex: 'Littoral'
  subtitle?: string;        // ex: 'Sidi Bou, Hammamet'
  img?: string;             // path to asset if type==='image'
  icon?: string;            // emoji or css class if type==='icon'
  type?: OptionType;        // optional rendering hint
}

export interface OnboardingStep {
  id: string;               // ex: 'decor'
  title: string;            // question title
  description?: string;     // optional subtitle for the step
  multi?: boolean;          // true = multi-select, false = single-select
  order_index: number;      // display order (NOT NULL in DB)
  options: OnboardingOption[];
}

export interface OnboardingPayload {
  userId?: string;
  answers: { [stepId: string]: string[] }; // mapping stepId -> selected option ids
}