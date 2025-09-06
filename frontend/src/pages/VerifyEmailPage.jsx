import { useUserStore } from "../stores/useUserStore";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";

import VerifyPanel from "../components/VerifyPanel";

const VerifyEmailPage = () => {
  const { verifyEmail, user } = useUserStore();
  const { token } = useParams();
  const navigate = useNavigate();

  const [verificationStatus, setVerificationStatus] = useState("initial"); // initial, verifying, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const hasVerifiedRef = useRef(false);

  // Ensure that the verification process is only attempted once
  useEffect(() => {
    console.log("VerifyEmailPage useEffect triggered:", {
      token,
      hasVerified: hasVerifiedRef.current,
    });

    if (token && !hasVerifiedRef.current) {
      hasVerifiedRef.current = true; // Mark as attempted immediately
      console.log("Starting verification process...");
      handleVerification();
    } else if (!token && !hasVerifiedRef.current) {
      setVerificationStatus("error");
    } else if (!token && hasVerifiedRef.current) {
      setVerificationStatus("success");
    }
  }, [token]);

  const handleVerification = async () => {
    console.log("handleVerification called");
    setVerificationStatus("verifying");

    try {
      setTimeout(async () => {
        await verifyEmail(token);
      }, 2000);
      setVerificationStatus("success");
      // Auto redirect to home after 10 seconds
      setTimeout(() => {
        navigate("/");
      }, 10000);
    } catch (error) {
      setVerificationStatus("error");
      setErrorMessage(error.response?.data?.message || "Verification failed");
    }
  };

  const renderContent = () => {
    return (
      <VerifyPanel
        verificationStatus={verificationStatus}
        errorMessage={errorMessage}
        user={user}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-4 group">
            <div className="size-14 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Mail className="size-10 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-emerald-400">
              Verify Email
            </h1>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-400 hover:text-emerald-400 transition duration-300 ease-in-out 
                     flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
