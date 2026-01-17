import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import { clearUser } from "../../../redux/slices/authslice";

export const logoutUser = async (dispatch, router) => {
  try {
    // 🔥 Call backend logout
    await API.post("/logout");

    // 🔥 Clear redux user state
    dispatch(clearUser());

    // 🔥 Show success message
    toast.success("✅ Logged out successfully");

    // 🔥 Navigate to login page
    router.push("/auth/login");
  } catch (error) {
    toast.error(error.response?.data?.message || "Logout failed, please try again.");
  }
};
