// src/api/exercise.ts
import axios from "axios";
import { API_URL } from "../config";
import API from "./auth";

// Correction de l'URL pour correspondre au mapping du backend
const EXERCISE_API_BASE = `${API_URL}/v1/exercises`;

export interface MuscleGroup {
  id: number;
  label: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Exercise {
  id: number;
  name: string;
  description: string;
  exerciseUrl: string;
  equipment: string;
  instructions: string;
  difficulty: string;
  muscleGroupId: number;
  muscleGroupLabel: string;
  muscleSubgroup: string;
  coachId: number;
  coachName: string;
}

/**
 * DTO utilisé pour la création/mise à jour d'un exercice.
 * Le champ coachId est **déduit** du token côté serveur.
 */
export interface CreateExerciseDto {
  name: string;
  description: string;
  exerciseUrl: string;
  equipment: string;
  instructions: string;
  difficulty: string;
  muscleGroupId: number;
  muscleSubgroup: string;
}

export const exerciseApi = {
  async createExercise(dto: CreateExerciseDto): Promise<Exercise> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    try {
      const res = await axios.post<Exercise>(EXERCISE_API_BASE, dto, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error: any) {
      console.error(
        "Erreur lors de la création de l'exercice:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async getExercises(): Promise<Exercise[]> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    try {
      const res = await axios.get<Exercise[]>(EXERCISE_API_BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error: any) {
      console.error(
        "Erreur lors de la récupération des exercices:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async getMuscleGroups(): Promise<MuscleGroup[]> {
    try {
      const res = await API.get<MuscleGroup[]>("/api/muscle-groups");
      return res.data.filter(
        (g, idx, arr) => arr.findIndex((x) => x.label === g.label) === idx
      );
    } catch (error: any) {
      console.error(
        "Erreur lors de la récupération des groupes musculaires:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deleteExercise: async (id: number): Promise<void> => {
    await API.delete(`/exercises/${id}`);
  },

  // (autres méthodes : updateExercise, deleteExercise, etc.)
};
