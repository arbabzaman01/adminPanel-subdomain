"use client";
import { useState, useEffect } from "react";
import { adminProfile as defaultAdminProfile } from "@/app/lib/dummy-data";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { toast } from "sonner";
import { Eye, EyeOff, User, Mail, Shield, Lock } from "lucide-react";
import { validatePassword } from "@/utils/password-validation";
import { updatePassword, getAdminProfile } from "@/utils/password-update";
import { SUPER_ADMIN_PASSWORD } from "@/utils/auth";

const Settings = () => {
  const [profile, setProfile] = useState(defaultAdminProfile);
  const [isEditing, setIsEditing] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
  const [storedPassword, setStoredPassword] = useState<string>("");

  // Load admin profile from localStorage on mount
  useEffect(() => {
    const loadAdminProfile = () => {
      try {
        const storedProfile = localStorage.getItem("adminProfile");
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);
          setProfile(parsedProfile);
        }
      } catch (error) {
        console.error("Error loading admin profile:", error);
        // Fallback to default profile if localStorage fails
        setProfile(defaultAdminProfile);
      }
    };

    loadAdminProfile();

    // Load stored password
    const loadPassword = async () => {
      const adminData = await getAdminProfile();
      setStoredPassword(adminData?.password || "");
    };
    loadPassword();
  }, []);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedProfile = {
      ...profile,
      name: formData.get("name") as string,
      // Email is read-only, keep existing email
    };
    setProfile(updatedProfile);
    
    // Save to localStorage
    try {
      localStorage.setItem("adminProfile", JSON.stringify(updatedProfile));
    } catch (error) {
      console.error("Error saving admin profile:", error);
    }
    
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Sanitize inputs
    const sanitizedCurrent = currentPassword.trim();
    const sanitizedNew = newPassword.trim();
    const sanitizedConfirm = confirmPassword.trim();

    // Validate all fields are filled
    if (!sanitizedCurrent || !sanitizedNew || !sanitizedConfirm) {
      toast.error("Current password incorrect or new passwords do not match", { duration: 5000 });
      return;
    }

    // Validate password change
    const validation = validatePassword(
      sanitizedCurrent,
      sanitizedNew,
      sanitizedConfirm,
      storedPassword || SUPER_ADMIN_PASSWORD
    );

    if (!validation.isValid) {
      toast.error("Current password incorrect or new passwords do not match", { duration: 5000 });
      return;
    }

    setIsChangingPassword(true);

    try {
      const result = await updatePassword(sanitizedCurrent, sanitizedNew);

      if (result.success) {
        toast.success("Password updated successfully", { duration: 5000 });
        // Reset form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsPasswordFormOpen(false);
        // Update stored password for future validation
        setStoredPassword(sanitizedNew);
      } else {
        toast.error("Current password incorrect or new passwords do not match", { duration: 5000 });
      }
    } catch (error) {
      toast.error("Current password incorrect or new passwords do not match", { duration: 5000 });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordFormOpen(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your admin profile settings</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">{profile.role}</p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      defaultValue={profile.name}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      className="pl-10 bg-muted cursor-not-allowed"
                      readOnly
                      disabled
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Save Changes</Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.name}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="flex items-center space-x-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.role}</span>
                  </div>
                </div>
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your password and security settings</CardDescription>
          </CardHeader>
          <CardContent>
            {!isPasswordFormOpen ? (
              <Button variant="outline" onClick={() => setIsPasswordFormOpen(true)}>
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="pr-11"
                      required
                    />
                    <button
                      type="button"
                      aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 8 chars, 1 number, 1 special char)"
                      className="pr-11"
                      required
                    />
                    <button
                      type="button"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters with 1 number and 1 special character
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="pr-11"
                      required
                    />
                    <button
                      type="button"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelPasswordChange}
                    disabled={isChangingPassword}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
