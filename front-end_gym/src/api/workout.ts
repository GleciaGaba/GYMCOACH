import axios from "axios";
import { API_URL } from "../config";
import { Exercise } from "./exercise";
import { workoutMockApi } from "./workoutMock";

const WORKOUT_API_URL = `${API_URL}/workouts`;

export interface WorkoutExercise {
  exerciseId: number;
  repetitions: number;
  series: number;
  pause: number;
}

export interface Workout {
  id: number;
  name: string;
  groups: string;
  workoutDescription: string;
  exercises: WorkoutExercise[];
  coachId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkoutDto {
  name: string;
  groups: string;
  workoutDescription: string;
  exercises: WorkoutExercise[];
}

export interface UpdateWorkoutDto extends CreateWorkoutDto {}

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
      console.log("Backend workout API failed, using mock data");
      return workoutMockApi.createWorkout(workoutData);
    }
  },

  getWorkouts: async (): Promise<Workout[]> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(WORKOUT_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Backend workout API failed, using mock data");
      return workoutMockApi.getWorkouts();
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
      console.log("Backend workout API failed, using mock data");
      return workoutMockApi.getWorkoutById(id);
    }
  },

  updateWorkout: async (
    id: number,
    workoutData: UpdateWorkoutDto
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
      console.log("Backend workout API failed, using mock data");
      return workoutMockApi.updateWorkout(id, workoutData);
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
      console.log("Backend workout API failed, using mock data");
      return workoutMockApi.deleteWorkout(id);
    }
  },
};
