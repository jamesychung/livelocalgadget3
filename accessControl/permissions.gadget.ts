import type { GadgetPermissions } from "gadget-server";

/**
 * This metadata describes the access control configuration available in your application.
 * Grants that are not defined here are set to false by default.
 *
 * View and edit your roles and permissions in the Gadget editor at https://livelocalgadget6.gadget.app/edit/settings/permissions
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    unauthenticated: {
      storageKey: "unauthenticated",
      models: {
        user: {
          actions: {
            resetPassword: true,
            sendResetPassword: true,
            signIn: true,
            signUp: true,
            verifyEmail: true,
          },
        },
      },
    },
    admin: {
      storageKey: "admin",
      default: {
        read: true,
        action: true,
      },
      models: {
        booking: {
          read: true,
          actions: {
            update: true,
          },
        },
        event: {
          read: true,
          actions: {
            create: true,
            update: true,
          },
        },
        eventHistory: {
          read: true,
          actions: {
            create: true,
          },
        },
        musician: {
          read: true,
          actions: {
            create: true,
            update: true,
          },
        },
        review: {
          read: true,
        },
        user: {
          read: true,
          actions: {
            changePassword: true,
            delete: true,
            resetPassword: true,
            sendResetPassword: true,
            sendVerifyEmail: true,
            signIn: true,
            signOut: true,
            signUp: true,
            update: true,
            verifyEmail: true,
          },
        },
        venue: {
          read: true,
          actions: {
            create: true,
            update: true,
          },
        },
      },
    },
    musician: {
      storageKey: "musician",
      default: {
        read: true,
        action: true,
      },
      models: {
        booking: {
          read: true,
          actions: {
            update: true,
          },
        },
        event: {
          read: true,
          actions: {
            create: true,
            update: true,
          },
        },
        eventHistory: {
          read: true,
          actions: {
            create: true,
          },
        },
        musician: {
          read: true,
          actions: {
            create: true,
            update: true,
          },
        },
        review: {
          read: true,
        },
        user: {
          read: true,
          actions: {
            changePassword: true,
            signOut: true,
            update: true,
          },
        },
      },
    },
    "signed-in": {
      storageKey: "signed-in",
      default: {
        read: true,
        action: true,
      },
      models: {
        booking: {
          read: true,
          actions: {
            update: true,
          },
        },
        event: {
          read: true,
          actions: {
            create: true,
            update: true,
          },
        },
        eventHistory: {
          read: true,
          actions: {
            create: true,
          },
        },
        musician: {
          read: true,
          actions: {
            create: true,
            update: true,
          },
        },
        review: {
          read: true,
        },
        user: {
          read: true,
          actions: {
            changePassword: true,
            signIn: true,
            signOut: true,
            update: true,
          },
        },
        venue: {
          read: true,
          actions: {
            create: true,
            update: true,
          },
        },
      },
      actions: {
        sendBookingEmails: true,
        sendEmail: true,
      },
    },
    venueOwner: {
      storageKey: "venue-owner",
      default: {
        read: true,
        action: true,
      },
      models: {
        booking: {
          read: true,
          actions: {
            update: true,
          },
        },
        event: {
          read: true,
          actions: {
            create: true,
            update: true,
          },
        },
        eventHistory: {
          read: true,
          actions: {
            create: true,
          },
        },
        review: {
          read: true,
        },
        user: {
          read: true,
          actions: {
            changePassword: true,
            signOut: true,
            update: true,
          },
        },
        venue: {
          read: true,
          actions: {
            create: true,
            update: true,
          },
        },
      },
    },
  },
};
