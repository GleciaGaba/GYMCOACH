import axios from "axios";
import { API_URL } from "../config";
import { Exercise } from "./exercise";

const WORKOUT_API_URL = `${API_URL}/workouts`;

export interface Workout {
  id: number;
  name: string;
  description: string;
  exercises: Exercise[];
  coachId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkoutDto {
  name: string;
  description: string;
  exerciseIds: number[];
}

export const workoutApi = {
  createWorkout: async (workoutData: CreateWorkoutDto): Promise<Workout> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(WORKOUT_API_URL, workoutData, {
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

  getWorkouts: async (): Promise<Workout[]> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${WORKOUT_API_URL}/my_workouts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching workouts:", error);
      throw error;
    }
  },

  getWorkoutById: async (id: number): Promise<Workout> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${WORKOUT_API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching workout:", error);
      throw error;
    }
  },

  updateWorkout: async (
    id: number,
    workoutData: Partial<CreateWorkoutDto>
  ): Promise<Workout> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(
        `${WORKOUT_API_URL}/${id}`,
        workoutData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating workout:", error);
      throw error;
    }
  },

  deleteWorkout: async (id: number): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.delete(`${WORKOUT_API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error deleting workout:", error);
      throw error;
    }
  },
};
