import axios from "axios";
import { API_URL } from "../config";

const EXERCISE_API_URL = `${API_URL}/exercises`;

export interface Exercise {
  id: number;
  name: string;
  description: string;
  exerciseUrl?: string;
  equipment: string;
  instructions: string;
  difficulty: string;
  muscleGroupLabel: string;
}

export interface CreateExerciseDto {
  name: string;
  description: string;
  muscleGroupId: number;
  difficulty: string;
  equipment: string;
  instructions: string;
  exerciseUrl?: string;
}

export const exerciseApi = {
  createExercise: async (
    exerciseData: CreateExerciseDto
  ): Promise<Exercise> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(EXERCISE_API_URL, exerciseData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessage = Object.entries(validationErrors)
          .map(([field, message]) => `${field}: ${message}`)
          .join("\n");
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  getExercises: async (): Promise<Exercise[]> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${EXERCISE_API_URL}/my_exercises`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching exercises:", error);
      throw error;
    }
  },

  getExerciseById: async (id: number): Promise<Exercise> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${EXERCISE_API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching exercise:", error);
      throw error;
    }
  },

  updateExercise: async (
    id: number,
    exerciseData: Partial<CreateExerciseDto>
  ): Promise<Exercise> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(
        `${EXERCISE_API_URL}/${id}`,
        exerciseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating exercise:", error);
      throw error;
    }
  },

  deleteExercise: async (id: number): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.delete(`${EXERCISE_API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error deleting exercise:", error);
      throw error;
    }
  },
};
