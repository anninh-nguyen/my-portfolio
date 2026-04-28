import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";
import ProfileForm from "@/components/admin/ProfileForm";
import WorkExperienceForm from "@/components/admin/WorkExperienceForm";
import EducationForm from "@/components/admin/EducationForm";
import HobbiesForm from "@/components/admin/HobbiesForm";
import MessagesList from "@/components/admin/MessagesList";

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  const handleSignOut = async () => {
    await signOut();
    queryClient.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Edit Portfolio</h1>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-1.5 h-4 w-4" /> Sign out
          </Button>
        </div>

        <ProfileForm userId={user.id} />
        <Separator className="my-8" />
        <WorkExperienceForm userId={user.id} />
        <Separator className="my-8" />
        <EducationForm userId={user.id} />
        <Separator className="my-8" />
        <HobbiesForm userId={user.id} />
        <Separator className="my-8" />
        <MessagesList />
      </div>
    </div>
  );
};

export default Admin;
