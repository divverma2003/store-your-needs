import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Save, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import FormInput from "../components/FormInput";
import toast from "react-hot-toast";
import { set } from "mongoose";

const ProfilePage = () => {
  const { user, updateProfile, logout, loading } = useUserStore();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'security'

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Validate that at least one field is being updated
    if (!formData.name && !formData.email) {
      return toast.error("Please provide name or email to update.");
    }

    try {
      await updateProfile({
        name: formData.name || undefined,
        email: formData.email !== user?.email ? formData.email : undefined,
      });

      // Reset only email if it's pending verification
      if (formData.email !== user?.email) {
        setFormData((prev) => ({ ...prev, email: user?.email || "" }));
      }
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword) {
      return toast.error("Please provide current and new password.");
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      return toast.error("New passwords do not match.");
    }

    if (formData.newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }

    try {
      await updateProfile({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      // Clear password fields on success
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));

      // Log out the user after password change
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error) {
      console.error("Password update error:", error);

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-emerald-400 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-400">
            Manage your account information and security settings
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-4 mb-6 border-b border-gray-700"
        >
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === "profile"
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === "security"
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Security
          </button>
        </motion.div>

        {/* Profile Information Tab */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-lg shadow-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <User className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Profile Information
                </h2>
                <p className="text-sm text-gray-400">
                  Update your personal details
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <FormInput
                icon={User}
                type="text"
                id="name"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, name: value }))
                }
              />

              <FormInput
                icon={Mail}
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, email: value }))
                }
              />

              {user?.pendingEmail && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <p className="text-yellow-400 text-sm">
                    📧 <strong>Email verification pending:</strong>{" "}
                    {user.pendingEmail}
                  </p>
                  <p className="text-yellow-300/70 text-xs mt-1">
                    Please check your inbox and verify your new email address.
                  </p>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-400 text-sm">
                  <strong>Note:</strong> Email changes require verification. You
                  cannot update email and password at the same time.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg shadow-lg hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Update Profile
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-lg shadow-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <Lock className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Change Password
                </h2>
                <p className="text-sm text-gray-400">
                  Update your password to keep your account secure
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <FormInput
                icon={Lock}
                type="password"
                id="currentPassword"
                name="currentPassword"
                placeholder="Current Password"
                value={formData.currentPassword}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, currentPassword: value }))
                }
              />

              <FormInput
                icon={Lock}
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="New Password (min 8 characters)"
                value={formData.newPassword}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, newPassword: value }))
                }
              />

              <FormInput
                icon={Lock}
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                value={formData.confirmNewPassword}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmNewPassword: value,
                  }))
                }
              />

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">
                  <strong>⚠️ Important:</strong> Changing your password will log
                  you out of all devices. You'll need to login again with your
                  new password.
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-400 text-sm font-medium mb-2">
                  Password Requirements:
                </p>
                <ul className="text-blue-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>At least 8 characters long</li>
                  <li>Cannot be the same as your current password</li>
                  <li>Use a strong, unique password</li>
                </ul>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg shadow-lg hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Update Password
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Account Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800 rounded-lg shadow-xl p-6 mt-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Email Status</p>
              <p className="text-white flex items-center gap-2">
                {user?.isVerified && !user?.pendingEmail ? (
                  <>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Verified
                  </>
                ) : user?.isVerified && user?.pendingEmail ? (
                  <>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Pending Email Change Verification
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Unverified
                  </>
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Account Type</p>
              <p className="text-white capitalize">
                {user?.role || "Customer"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Member Since</p>
              <p className="text-white">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Last Updated</p>
              <p className="text-white">
                {user?.updatedAt
                  ? new Date(user.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
