/**
 * MedLens - Standard Clinical Dictionary for Patient Intake
 * Provides standardized medical terms for real-time autocomplete suggestions and quick chips.
 */

export const COMMON_SYMPTOMS: string[] = [
  "Fatigue",
  "Dizziness",
  "Lightheadedness",
  "Shortness of breath",
  "Chest pain",
  "Chest tightness",
  "Headache",
  "Migraine",
  "Fever",
  "Chills",
  "Palpitations",
  "Rapid heartbeat",
  "Nausea",
  "Vomiting",
  "Abdominal pain",
  "Joint pain",
  "Muscle weakness",
  "Cold hands and feet",
  "Blurred vision",
  "Excessive thirst",
  "Frequent urination",
  "Persistent cough",
  "Swelling in legs (Edema)",
  "Tremors",
  "Loss of appetite",
  "Unexplained weight loss",
  "Night sweats",
  "Brain fog",
  "Insomnia",
  "Anxiety / Nervousness",
];

export const POPULAR_SYMPTOM_QUICK_CHIPS: string[] = [
  "Fatigue",
  "Dizziness",
  "Shortness of breath",
  "Chest pain",
  "Headache",
  "Fever",
  "Palpitations",
  "Cold hands and feet",
];

export const COMMON_CONDITIONS: string[] = [
  "Hypertension",
  "Type 2 Diabetes",
  "Type 1 Diabetes",
  "Asthma",
  "Hyperlipidemia",
  "Hypothyroidism",
  "GERD / Acid Reflux",
  "Coronary Artery Disease",
  "Chronic Kidney Disease",
  "Osteoarthritis",
  "Migraine Disorder",
  "Anxiety Disorder",
];

export const COMMON_ALLERGIES: string[] = [
  "Penicillin",
  "Sulfa drugs",
  "Amoxicillin",
  "Aspirin",
  "Ibuprofen (NSAIDs)",
  "Latex",
  "Codeine",
  "Contrast dye / Iodine",
  "Peanuts",
  "Shellfish",
];

/**
 * Filter suggestions matching query, excluding items already selected
 */
export function getFilteredSuggestions(
  query: string,
  items: string[],
  alreadySelected: string[],
  limit: number = 6
): string[] {
  if (!query || !query.trim()) return [];
  const cleanQuery = query.trim().toLowerCase();
  const selectedSet = new Set(alreadySelected.map((s) => s.toLowerCase()));

  return items
    .filter(
      (item) =>
        item.toLowerCase().includes(cleanQuery) &&
        !selectedSet.has(item.toLowerCase())
    )
    .slice(0, limit);
}

