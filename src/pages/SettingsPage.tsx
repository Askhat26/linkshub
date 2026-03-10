import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Copy, ExternalLink, Link as LinkIcon, Share2 } from "lucide-react";

const SettingsPage = () => {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [saving, setSaving] = useState(false);

  // Build public URL
  const publicBaseUrl =
    import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin;

  const previewUsername = (form.username || user?.username || "").trim();
  const savedUsername = (user?.username || "").trim();

  const publicProfileUrl = useMemo(() => {
    return `${String(publicBaseUrl).replace(/\/$/, "")}/${previewUsername}`;
  }, [publicBaseUrl, previewUsername]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await authApi.updateProfile(form);
      await refreshUser();
      toast.success("Settings saved");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      return toast.error("Fill in both fields");
    }
    try {
      await authApi.changePassword(passwords);
      setPasswords({ currentPassword: "", newPassword: "" });
      toast.success("Password updated");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || err?.message || "Failed to update password"
      );
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    try {
      await authApi.deleteAccount();
      logout();
      navigate("/");
      toast.success("Account deleted");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || err?.message || "Failed to delete account"
      );
    }
  };

  const copyPublicLink = async () => {
    if (!previewUsername) return toast.error("Username missing");
    try {
      await navigator.clipboard.writeText(publicProfileUrl);
      toast.success("Link copied");
    } catch {
      toast.error("Copy failed (browser blocked clipboard)");
    }
  };

  const openPublicLink = () => {
    if (!previewUsername) return toast.error("Username missing");
    window.open(publicProfileUrl, "_blank", "noopener,noreferrer");
  };

  const sharePublicLink = async () => {
    if (!previewUsername) return toast.error("Username missing");

    const nav: any = navigator;
    if (nav.share) {
      try {
        await nav.share({
          title: `${form.name || user?.name || "Linkora"} profile`,
          text: "Check out my Linkora profile",
          url: publicProfileUrl,
        });
        return;
      } catch {
        // user cancelled; ignore
        return;
      }
    }

    // fallback to copy
    copyPublicLink();
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl space-y-6"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account
          </p>
        </div>

        {/* Profile */}
        <div className="glass rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-medium text-foreground">Profile</h3>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold text-primary-foreground">
              {(form.name?.trim()?.charAt(0) || "U").toUpperCase()}
            </div>
            <Button variant="outline" size="sm" disabled>
              Change Avatar (soon)
            </Button>
          </div>

          {[
            { key: "name", label: "Name", type: "text" },
            { key: "username", label: "Username", type: "text" },
            { key: "email", label: "Email", type: "email" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-xs text-muted-foreground mb-1 block">
                {f.label}
              </label>
              <Input
                value={(form as any)[f.key]}
                onChange={(e) =>
                  setForm({ ...form, [f.key]: e.target.value })
                }
                type={f.type}
                className="bg-secondary/50"
              />
            </div>
          ))}

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full rounded-xl bg-secondary/50 border border-border px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <Button
            onClick={handleSaveProfile}
            className="w-full"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Share / Copy Link */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">
              Share your public link
            </h3>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Public profile URL
            </label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={publicProfileUrl}
                className="bg-secondary/50"
              />
              <Button
                variant="outline"
                onClick={copyPublicLink}
                className="shrink-0"
              >
                <Copy className="w-4 h-4 mr-2" /> Copy
              </Button>
            </div>

            {savedUsername && previewUsername !== savedUsername && (
              <p className="text-xs text-muted-foreground mt-2">
                You changed your username. Click{" "}
                <span className="text-foreground">Save Changes</span> to make
                this link active.
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={openPublicLink}
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" /> Open
            </Button>
            <Button onClick={sharePublicLink} className="w-full">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
          </div>
        </div>

        {/* Change Password */}
        <div className="glass rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-medium text-foreground">
            Change Password
          </h3>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Current Password
            </label>
            <Input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
              placeholder="••••••••"
              className="bg-secondary/50"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              New Password
            </label>
            <Input
              type="password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
              placeholder="••••••••"
              className="bg-secondary/50"
            />
          </div>

          <Button
            variant="outline"
            onClick={handleChangePassword}
            className="w-full"
          >
            Update Password
          </Button>
        </div>

        {/* Danger Zone */}
        <div className="glass rounded-2xl p-6 border-destructive/20">
          <h3 className="text-sm font-medium text-destructive mb-2">
            Danger Zone
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Once you delete your account, there is no going back.
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SettingsPage;