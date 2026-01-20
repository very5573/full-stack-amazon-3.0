import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import { clearUser } from "../../../redux/slices/authslice";
import { resetRealtime } from "../../../redux/slices/realtimeSlice";

/**
 * Logout user function
 * @param {function} dispatch - Redux dispatch
 * @param {object} router - Next.js router
 * @param {object} presenceSocket - Socket instance
 */
export const logoutUser = async (dispatch, router, presenceSocket) => {
  try {
    // -----------------------------
    // 1️⃣ SOCKET LOGOUT → DB lastSeen update
    // -----------------------------
    if (presenceSocket?.connected) {
      // Emit manualLogout to socket server
      presenceSocket.emit("manualLogout");
    }

    // -----------------------------
    // 2️⃣ BACKEND LOGOUT → cookies clear
    // -----------------------------
    const res = await API.post("/logout");
    console.log("✅ Logout response:", res.data);

    // -----------------------------
    // 3️⃣ REDUX CLEANUP → auth + realtime
    // -----------------------------
    dispatch(clearUser());
    dispatch(resetRealtime());

    // -----------------------------
    // 4️⃣ FEEDBACK + NAVIGATION
    // -----------------------------
    toast.success("✅ Logged out successfully");
    router?.push("/auth/login");
  } catch (error) {
    console.error("❌ Logout error:", error);
    toast.error(
      error.response?.data?.message || "Logout failed, please try again."
    );
  }
};
