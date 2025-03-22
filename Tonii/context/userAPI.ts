import apiHandler from "./APIHandler";
import * as SecureStore from "expo-secure-store";

export const registerUser = async (
  username: string,
  email: string,
  dob: number,
  weight: number,
  height: number,
  gender: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const response = await apiHandler.post("/auth/register", {
      username,
      email,
      dob,
      height,
      weight,
      gender,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      status: 400,
      message: "Register failed.",
    };
  }
};

export const fetchUserDetails = async () => {
  try {
    const token = await SecureStore.getItemAsync("AccessToken"); // Retrieve token

    if (!token) {
      return { status: 401, message: "Unauthorized: No token found" };
    }

    const response = await apiHandler.get("/readUser", {
      headers: {
        Authorization: `Bearer ${token}`, // Send token in headers
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return { status: 400, message: "Error fetching user details." };
  }
};
export const workoutPlan = async () => {
  try {
    const token = await SecureStore.getItemAsync("AccessToken"); // Retrieve token

    if (!token) {
      return { status: 401, message: "Unauthorized: No token found" };
    }
    const response = await apiHandler.get("/user/workout-plans", {
      headers: {
        Authorization: `Bearer ${token}`, // Send token in headers
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return { status: 400, message: "Error fetching user details." };
  }
};

export const getWorkoutById = async (id: string) => {
  const token = await SecureStore.getItemAsync("AccessToken"); // Retrieve token

  if (!token) {
    return { status: 401, message: "Unauthorized: No token found" };
  }
  try {
    const response = await fetch(`/user/workout-plans${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Send token in headers
      },
    });
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 500, error };
  }
};


  