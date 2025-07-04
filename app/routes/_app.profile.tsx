import { UserIcon } from "../components/shared/UserIcon";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";
import { useOutletContext } from 'react-router-dom';
import { supabase } from "../lib/supabase";
import type { AuthOutletContext } from "./_app";

export default function Profile() {
  const { user } = useOutletContext<AuthOutletContext>();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const hasName = user.firstName || user.lastName;
  const title = hasName ? `${user.firstName} ${user.lastName}` : user.email;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="rounded-lg shadow p-6 bg-background border">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <UserIcon user={user} className="h-16 w-16" />
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              {hasName && <p className="text-gray-600">{user.email}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsChangingPassword(true)}>
              Change password
            </Button>
            <Button variant="ghost" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </div>
        </div>
      </div>
      <EditProfileModal
        open={isEditing}
        onClose={() => setIsEditing(false)}
      />
      <ChangePasswordModal
        open={isChangingPassword}
        onClose={() => setIsChangingPassword(false)}
      />
    </div>
  );
}

const EditProfileModal = (props: { open: boolean; onClose: () => void }) => {
  const { user } = useOutletContext<AuthOutletContext>();
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName
        })
        .eq('id', user.id);
      
      if (error) throw error;
      props.onClose();
    } catch (error: any) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label>First Name</Label>
              <Input 
                placeholder="First name" 
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input 
                placeholder="Last name" 
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={props.onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ChangePasswordModal = (props: { open: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: ""
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });
      
      if (error) {
        setErrors({ root: error.message });
      } else {
        props.onClose();
      }
    } catch (error: any) {
      setErrors({ root: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onClose = () => {
    setFormData({ currentPassword: "", newPassword: "" });
    setErrors({});
    props.onClose();
  };

  return (
    <Dialog open={props.open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input 
                type="password" 
                autoComplete="off" 
                value={formData.currentPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
              />
              {errors?.root && <p className="text-red-500 text-sm mt-1">{errors.root}</p>}
            </div>
            <div>
              <Label>New Password</Label>
              <Input 
                type="password" 
                autoComplete="off" 
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 
