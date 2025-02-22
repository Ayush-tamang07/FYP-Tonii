import apiHandler from "./APIHandler";
import * as SecureStore from "expo-secure-store";

export const loginUser = async (email: string, password: string) => {
  try {
    console.log("user_login", email, password);
    const response = await apiHandler.post("/auth/login", {
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      status: 400,
      message: "Login failed."
    };
  }
};

export const registerUser = async (
  name: string,
  email: string,
  dob: number,
  height: number,
  weight: number,
  gender: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const response = await apiHandler.post("/auth/register", {
      name,
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

export const userDetails = async () => {
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
export const createRoutine = async(name:string)=>{
  try {
    const response = await apiHandler.post("/user/workout-plans", {
      name
    });
    return response.data;
  } catch (error) {
    return{
      status: 500,
      message:"workout plan creation failed."
    }
  }
}
  