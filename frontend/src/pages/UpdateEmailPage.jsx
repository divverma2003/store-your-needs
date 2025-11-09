import { useUserStore } from "../stores/useUserStore";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mail, Loader, ArrowLeft, User } from "lucide-react";
import { motion } from "framer-motion";

const UpdateEmailPage = () => {
  const { verifyEmailChange, user } = useUserStore();
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");
  const hasUpdatedRef = useRef(false);

  useEffect(() => {
    if (token && !hasUpdatedRef.current) {
      hasUpdatedRef.current = true;
      handleVerificationUpdate();
    } else if (!token && hasUpdatedRef.current) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }, [token]);

  const handleVerificationUpdate = async () => {
    try {
      await verifyEmailChange(token);
      setStatus("success");
      setMessage("Email updated successfully.");

      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error?.response?.data?.message ||
          "Email verification failed. The link may be invalid or expired."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="size-14 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Mail className="size-10 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-400">
              Email Update
            </h1>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700 items-center">
          <p className="text-base text-gray-300">
            {status === "verifying" && (
              <span className="flex items-center gap-2">
                <Loader className="animate-spin" size={20} />
                Verifying your email change...
              </span>
            )}
            {status === "success" && (
              <>
                {message}{" "}
                {user?.email && (
                  <span className="text-emerald-400 font-semibold">
                    New email: {user.email}
                  </span>
                )}
              </>
            )}
            {status === "error" && (message || "Email update failed.")}
          </p>

          {status === "error" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate("/profile")}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg shadow-lg hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 flex items-center justify-center gap-2 text-base"
            >
              <User size={20} />
              Request New Link
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateEmailPage;
