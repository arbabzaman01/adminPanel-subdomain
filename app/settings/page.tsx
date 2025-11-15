"use client";
import { useState } from "react";
import { adminProfile } from "@/app/lib/dummy-data";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { toast } from "sonner";

import { User, Mail, Shield } from "lucide-react";

const Settings = () => {
  const [profile, setProfile] = useState(adminProfile);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setProfile({
      ...profile,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    });
    setIsEditing(false);
    toast.success("Profile updated successfully");
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
                      defaultValue={profile.email}
                      className="pl-10"
                      required
                    />
                  </div>
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
            <Button variant="outline" onClick={() => toast.info("Password change feature coming soon")}>
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
