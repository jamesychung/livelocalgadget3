# User Role System Implementation

## Overview

This implementation provides a three-tier role system for the Live Music Marketplace using Gadget's built-in authentication:

- **User (Fan/Consumer)**: Browse events, follow artists and venues
- **Musician**: Get booked, manage profile, promote themselves  
- **Venue**: Find musicians, manage events, promote venue

## Architecture

### 1. User Schema (`api/models/user/schema.gadget.ts`)

Added a `primaryRole` field to track the user's main role:
```typescript
primaryRole: {
  type: "select",
  options: [
    { label: "User", value: "user" },
    { label: "Musician", value: "musician" },
    { label: "Venue", value: "venue" }
  ],
  default: "user",
  storageKey: "primary_role",
}
```

### 2. Role Mapping

The system maps `primaryRole` to Gadget's internal roles:
- `user` → `["signed-in"]`
- `musician` → `["signed-in", "musician"]`
- `venue` → `["signed-in", "venueOwner"]`

### 3. Authentication Actions

#### Sign Up (`api/models/user/actions/signUp.ts`)
- Accepts `primaryRole` parameter
- Automatically assigns appropriate Gadget roles
- Creates profile records for musicians/venues

#### Update Role (`api/models/user/actions/updateRole.ts`)
- Allows users to change their primary role
- Updates Gadget roles accordingly
- Creates profile records if needed

### 4. Permissions (`accessControl/permissions.gadget.ts`)

Each role has specific permissions:
- **User**: Read access to events/musicians/venues, can create reviews
- **Musician**: Full access to musician profile, can create events/bookings
- **Venue Owner**: Full access to venue profile, can create events/bookings

## Frontend Implementation

### Role Selector Component

Use the `RoleSelector` component for role selection:

```tsx
import { RoleSelector } from './components/shared/RoleSelector';

// For signup
<RoleSelector 
  isSignup={true}
  onRoleChange={(role) => setSelectedRole(role)}
/>

// For existing users
<RoleSelector 
  currentRole={user.primaryRole}
  onRoleChange={(newRole) => handleRoleUpdate(newRole)}
/>
```

### Signup Flow

1. User enters email/password
2. User selects primary role
3. System creates user with appropriate roles
4. System creates profile record if needed (musician/venue)

### Role Update Flow

1. User navigates to profile settings
2. User selects new role
3. System updates user record
4. System creates profile record if needed
5. User gets new permissions immediately

## API Usage

### Sign Up with Role
```typescript
await api.user.signUp({
  email: "user@example.com",
  password: "securepassword",
  primaryRole: "musician",
  firstName: "John",
  lastName: "Doe"
});
```

### Update Role
```typescript
await api.user.updateRole({
  primaryRole: "venue"
});
```

### Check User Role
```typescript
const user = await api.user.findOne({
  filter: { id: { equals: userId } }
});

console.log(user.primaryRole); // "musician", "venue", or "user"
```

## Profile Creation

When a user selects musician or venue role, the system automatically creates a profile record:

### Musician Profile
```typescript
await api.musician.create({
  user: { _link: userId },
  name: `${firstName} ${lastName}`,
  email: userEmail,
  isActive: true
});
```

### Venue Profile
```typescript
await api.venue.create({
  owner: { _link: userId },
  name: `${firstName} ${lastName}`,
  email: userEmail,
  isActive: true
});
```

## Security Considerations

1. **Role Validation**: Users can only update their own roles
2. **Permission Inheritance**: Gadget roles determine actual permissions
3. **Profile Ownership**: Users can only access their own profiles
4. **Session Management**: Role changes take effect immediately

## Migration Notes

For existing users:
1. All existing users will have `primaryRole: "user"` by default
2. They can update their role using the `updateRole` action
3. Profile records will be created when they change to musician/venue roles

## Testing

Test the role system by:
1. Creating users with different roles
2. Updating roles for existing users
3. Verifying profile creation
4. Checking permission enforcement
5. Testing role-based UI rendering 