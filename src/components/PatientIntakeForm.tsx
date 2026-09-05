import React, { useState } from "react";
import { PatientIntake, Medication } from "@/lib/types";
import { SYNTHETIC_PATIENTS } from "@/lib/mockData";
import { User, Plus, Trash2, Sparkles, CheckCircle2 } from "lucide-react";

interface PatientIntakeFormProps {
  patient: PatientIntake;
  onChange: (patient: PatientIntake) => void;
}

export const PatientIntakeForm: React.FC<PatientIntakeFormProps> = ({ patient, onChange }) => {
  const [newSymptom, setNewSymptom] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedName, setNewMedName] = useState("");
  const [newMedDose, setNewMedDose] = useState("");

  const handleSelectPreset = (presetId: string) => {
    const selected = SYNTHETIC_PATIENTS.find((p) => p.id === presetId);
    if (selected) {
      onChange({ ...selected, createdAt: new Date().toISOString() });
    }
  };

  const addSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymptom.trim()) {
      onChange({ ...patient, symptoms: [...patient.symptoms, newSymptom.trim()] });
      setNewSymptom("");
    }
  };

  const removeSymptom = (index: number) => {
    onChange({ ...patient, symptoms: patient.symptoms.filter((_, i) => i !== index) });
  };

  const addCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCondition.trim()) {
      onChange({ ...patient, existingConditions: [...patient.existingConditions, newCondition.trim()] });
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    onChange({ ...patient, existingConditions: patient.existingConditions.filter((_, i) => i !== index) });
  };

  const addAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAllergy.trim()) {
      onChange({ ...patient, allergies: [...patient.allergies, newAllergy.trim()] });
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    onChange({ ...patient, allergies: patient.allergies.filter((_, i) => i !== index) });
  };

  const addMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMedName.trim()) {
      const newMed: Medication = {
        name: newMedName.trim(),
        dosage: newMedDose.trim() || undefined,
        frequency: "As prescribed",
      };
      onChange({ ...patient, medications: [...patient.medications, newMed] });
      setNewMedName("");
      setNewMedDose("");
    }
  };

  const removeMedication = (index: number) => {
    onChange({ ...patient, medications: patient.medications.filter((_, i) => i !== index) });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
            <User className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">1. Patient Information Intake</h2>
            <p className="text-xs text-slate-500">Capture subjective patient demographics, symptoms, and current regimens</p>
          </div>
        </div>

        {/* 1-Click Synthetic Presets for Evaluator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            Quick Presets:
          </span>
          <select
            aria-label="Select synthetic patient preset"
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
            defaultValue=""
          >
            <option value="" disabled>
              Select Demo Patient...
            </option>
            {SYNTHETIC_PATIENTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName} ({p.age}y/o, {p.sex})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 space-y-5 text-sm">
        {/* Basic Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="patient-name" className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name / Identifier
            </label>
            <input
              id="patient-name"
              type="text"
              required
              value={patient.fullName}
              onChange={(e) => onChange({ ...patient, fullName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="patient-age" className="block text-xs font-semibold text-slate-700 mb-1">
              Age (Years)
            </label>
            <input
              id="patient-age"
              type="number"
              min={0}
              max={120}
              required
              value={patient.age || ""}
              onChange={(e) => onChange({ ...patient, age: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="patient-sex" className="block text-xs font-semibold text-slate-700 mb-1">
              Biological Sex
            </label>
            <select
              id="patient-sex"
              value={patient.sex}
              onChange={(e) => onChange({ ...patient, sex: e.target.value as any })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Symptoms & Conditions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Symptoms */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Reported Symptoms
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[32px]">
              {patient.symptoms.map((sym, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-medium"
                >
                  {sym}
                  <button
                    type="button"
                    onClick={() => removeSymptom(idx)}
                    aria-label={`Remove symptom ${sym}`}
                    className="hover:text-sky-950 p-0.5"
                  >
                    &times;
                  </button>
                </span>
              ))}
              {patient.symptoms.length === 0 && (
                <span className="text-xs text-slate-400 italic">No symptoms entered</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add symptom (e.g. Fatigue)..."
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSymptom(e)}
                className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={addSymptom}
                className="px-2.5 py-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Existing Conditions */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Existing Medical Conditions
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[32px]">
              {patient.existingConditions.map((cond, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-medium"
                >
                  {cond}
                  <button
                    type="button"
                    onClick={() => removeCondition(idx)}
                    aria-label={`Remove condition ${cond}`}
                    className="hover:text-slate-950 p-0.5"
                  >
                    &times;
                  </button>
                </span>
              ))}
              {patient.existingConditions.length === 0 && (
                <span className="text-xs text-slate-400 italic">None reported</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add condition (e.g. Hypertension)..."
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCondition(e)}
                className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={addCondition}
                className="px-2.5 py-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Allergies and Medications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Allergies */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Known Allergies
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[32px]">
              {patient.allergies.map((allg, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-medium"
                >
                  {allg}
                  <button
                    type="button"
                    onClick={() => removeAllergy(idx)}
                    aria-label={`Remove allergy ${allg}`}
                    className="hover:text-rose-950 p-0.5"
                  >
                    &times;
                  </button>
                </span>
              ))}
              {patient.allergies.length === 0 && (
                <span className="text-xs text-slate-400 italic">No known drug allergies (NKDA)</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add allergy (e.g. Penicillin)..."
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addAllergy(e)}
                className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={addAllergy}
                className="px-2.5 py-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Medications */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Active Medications & Supplements
            </label>
            <div className="space-y-1.5 mb-2.5 min-h-[32px]">
              {patient.medications.map((med, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs"
                >
                  <span className="font-semibold text-slate-800">{med.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{med.dosage || "Dose unstated"}</span>
                    <button
                      type="button"
                      onClick={() => removeMedication(idx)}
                      aria-label={`Remove medication ${med.name}`}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
              {patient.medications.length === 0 && (
                <span className="text-xs text-slate-400 italic">No active medications recorded</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Medication name..."
                value={newMedName}
                onChange={(e) => setNewMedName(e.target.value)}
                className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Dosage (e.g. 500mg)..."
                value={newMedDose}
                onChange={(e) => setNewMedDose(e.target.value)}
                className="w-28 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={addMedication}
                className="px-2.5 py-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Clinical Intake Provenance Stamp */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-purple-600" aria-hidden="true" />
            <span>
              Intake Data Origin: <strong className="text-purple-700">Patient Provided</strong> (Subjective clinical history)
            </span>
          </div>
          <span>Created: {new Date(patient.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

