import { Workout, CreateWorkoutDto, UpdateWorkoutDto } from "./workout";
import { mockWorkouts, simulateNetworkDelay } from "../utils/mockData";

let workouts = [...mockWorkouts];
let nextId = Math.max(...workouts.map((w) => w.id)) + 1;

export const workoutMockApi = {
  createWorkout: async (workoutData: CreateWorkoutDto): Promise<Workout> => {
    await simulateNetworkDelay();

    const newWorkout: Workout = {
      id: nextId++,
      ...workoutData,
      coachId: 1, // Mock coach ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    workouts.push(newWorkout);
    return newWorkout;
  },

  getWorkouts: async (): Promise<Workout[]> => {
    await simulateNetworkDelay();
    return [...workouts];
  },

  getWorkoutById: async (id: number): Promise<Workout> => {
    await simulateNetworkDelay();

    const workout = workouts.find((w) => w.id === id);
    if (!workout) {
      throw new Error("Workout not found");
    }

    return workout;
  },

  updateWorkout: async (
    id: number,
    workoutData: UpdateWorkoutDto
  ): Promise<Workout> => {
    await simulateNetworkDelay();

    const index = workouts.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new Error("Workout not found");
    }

    workouts[index] = {
      ...workouts[index],
      ...workoutData,
      updatedAt: new Date().toISOString(),
    };

    return workouts[index];
  },

  deleteWorkout: async (id: number): Promise<void> => {
    await simulateNetworkDelay();

    const index = workouts.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new Error("Workout not found");
    }

    workouts.splice(index, 1);
  },
};
