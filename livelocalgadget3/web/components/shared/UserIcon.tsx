import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { api } from "../../api";

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  primaryRole?: string;
  profilePicture?: {
    url: string;
  } | null;
  googleImageUrl?: string | null;
}

interface UserIconProps {
  user: User;
  className?: string;
}

export const UserIcon = ({ user, className }: UserIconProps) => {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfilePicture = async () => {
      if (!user?.id || !user?.primaryRole) return;

      setLoading(true);
      try {
        let pictureUrl: string | null = null;

        // Try to get profile picture from musician profile
        if (user.primaryRole === 'musician') {
          const musicianResult = await api.musician.findMany({
            filter: { user: { id: { equals: user.id } } },
            select: { profilePicture: true },
            first: 1
          });
          
          if (musicianResult.length > 0 && musicianResult[0].profilePicture) {
            pictureUrl = musicianResult[0].profilePicture;
          }
        }
        // Try to get profile picture from venue profile
        else if (user.primaryRole === 'venue') {
          const venueResult = await api.venue.findMany({
            filter: { owner: { id: { equals: user.id } } },
            select: { profilePicture: true },
            first: 1
          });
          
          if (venueResult.length > 0 && venueResult[0].profilePicture) {
            pictureUrl = venueResult[0].profilePicture;
          }
        }

        setProfilePictureUrl(pictureUrl);
      } catch (error) {
        console.error('Error loading profile picture:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfilePicture();
  }, [user?.id, user?.primaryRole]);

  // Priority order for profile picture:
  // 1. Role-specific profile picture (musician/venue)
  // 2. User profile picture
  // 3. Google image URL
  // 4. Fallback to initials
  const imageUrl = profilePictureUrl || 
                   user.profilePicture?.url || 
                   user.googleImageUrl || 
                   "";

  return (
    <Avatar className={className}>
      <AvatarImage 
        src={imageUrl} 
        alt={user.firstName || user.email}
        className={loading ? "opacity-50" : ""}
      />
      <AvatarFallback>
        {loading ? (
          <div className="animate-pulse bg-gray-200 rounded-full w-full h-full" />
        ) : (
          getInitials(user)
        )}
      </AvatarFallback>
    </Avatar>
  );
};

const getInitials = (user: User) => {
  if (user.firstName || user.lastName) {
    return ((user.firstName?.slice(0, 1) ?? "") + (user.lastName?.slice(0, 1) ?? "")).toUpperCase();
  } else {
    return user.email.slice(0, 1).toUpperCase();
  }
};