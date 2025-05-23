import { AxiosError } from "axios";
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
export const deleteWorkoutPlan = async (workoutPlanId: number) => {
  try {
    const token = await SecureStore.getItemAsync("AccessToken");

    if (!token) {
      return { status: 401, message: "Unauthorized: No token found" };
    }
    const response = await apiHandler.delete(`workout-plans/${workoutPlanId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {}
};

export const finishWorkout = async (id: number) => {
  try {
    const token = await SecureStore.getItemAsync("AccessToken");

    if (!token) {
      return { status: 401, message: "Unauthorized: No token found" };
    }
    const response = await apiHandler.post(
      "/user/finish-workout",
      { workoutPlanId:id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    return { status: 500, message: "Something went wrong" };
  }
};
export const userProgress = async () => {
  try {
    const token = await SecureStore.getItemAsync("AccessToken");

    if (!token) {
      return { status: 401, message: "Unauthorized: No token found" };
    }
    const response = await apiHandler.get("/user/getProgress", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return { status: 500, message: "Internal Server Error", error };
  }
};

export const sendFeedback = async (
  feedback_type: string,
  description: string
) => {
  try {
    const token = await SecureStore.getItemAsync("AccessToken");

    if (!token) {
      return { status: 401, message: "Unauthorized: No token found" };
    }

    const response = await apiHandler.post(
      "user/addFeedback",
      { feedback_type, description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Feedback submission error:", error);
    return { status: 400, message: "Failed to send feedback" };
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
    // console.error("Error fetching workout:", error);
    return { status: 400, message: "Error fetching workout." };
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
interface PinWorkoutPlanData {
  workoutPlanId: number;
  pin: boolean;
}

interface ApiResponse {
  status: number;
  message?: string;
  workoutPlan?: any;
  [key: string]: any;
}
interface ErrorResponseData {
  message?: string;
  [key: string]: any;
}

export const pinWorkoutPlan = async (
  data: PinWorkoutPlanData
): Promise<ApiResponse> => {
  try {
    const token = await SecureStore.getItemAsync("AccessToken");

    if (!token) {
      return { status: 401, message: "Unauthorized: No token found" };
    }

    // Set the authorization header
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Send data directly - Axios handles JSON conversion
    const response = await apiHandler.post("/workout-plans/pin", data, config);

    // Axios automatically converts response to JSON
    return {
      status: response.status,
      ...response.data,
    };
  } catch (error: unknown) {
    console.error("Error pinning workout plan:", error);

    // Type guard to check if it's an Axios error
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as AxiosError<ErrorResponseData>;

      if (axiosError.response) {
        const errorData = axiosError.response.data || {};

        return {
          status: axiosError.response.status,
          message: errorData.message || `Error: ${axiosError.response.status}`,
          ...errorData,
        };
      }
    }

    return {
      status: 500,
      message: "Network error occurred",
    };
  }
};
export const updateUserDetails = async (formData: FormData) => {
  try {
    const token = await SecureStore.getItemAsync("AccessToken");
    const response = await apiHandler.put(
      '/user/updateUser',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.status === 200;
  } catch (error) {
    // console.error('Update error:', error);
    return false;
  }
};

