import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { api } from '../../api';

interface RoleSelectorProps {
  currentRole?: string;
  onRoleChange?: (newRole: string) => void;
  isSignup?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ 
  currentRole = 'user', 
  onRoleChange,
  isSignup = false 
}) => {
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [isUpdating, setIsUpdating] = useState(false);

  const roles = [
    { value: 'user', label: 'User (Fan/Consumer)', description: 'Browse events, follow artists and venues' },
    { value: 'musician', label: 'Musician', description: 'Get booked, manage profile, promote yourself' },
    { value: 'venue', label: 'Venue Owner', description: 'Find musicians, manage events, promote venue' }
  ];

  const handleRoleChange = async () => {
    if (isSignup) {
      // For signup, just update the local state
      setSelectedRole(selectedRole);
      onRoleChange?.(selectedRole);
      return;
    }

    // For existing users, update their role via API
    setIsUpdating(true);
    try {
      await api.user.updateRole({
        primaryRole: selectedRole
      });
      onRoleChange?.(selectedRole);
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {isSignup ? 'Choose Your Role' : 'Update Your Role'}
        </CardTitle>
        <CardDescription>
          {isSignup 
            ? 'Select how you plan to use the platform'
            : 'Change your primary role on the platform'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Primary Role</label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{role.label}</span>
                    <span className="text-xs text-muted-foreground">{role.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleRoleChange}
          disabled={isUpdating || selectedRole === currentRole}
          className="w-full"
        >
          {isUpdating ? 'Updating...' : isSignup ? 'Continue' : 'Update Role'}
        </Button>

        {!isSignup && selectedRole !== currentRole && (
          <p className="text-xs text-muted-foreground">
            Changing your role will update your permissions and may create a profile for you.
          </p>
        )}
      </CardContent>
    </Card>
  );
}; 