import type { GadgetPermissions } from "gadget-server";

/**
 * Open permissions - no filters, just basic role-based access
 * This should eliminate any tenant filter requirements
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    unauthenticated: {
      storageKey: "unauthenticated",
      default: {
        read: false,
        action: false,
      },
      models: {
        user: {
          read: false,
          actions: {
            signIn: true,
            signUp: true,
            sendResetPassword: true,
            resetPassword: true,
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
        event: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true,
          },
        },
        musician: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true,
          },
        },
        venue: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true,
          },
        },
        booking: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true,
          },
        },
        review: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true,
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
        user: {
          read: true,
          actions: {
            changePassword: true,
            signIn: true,
            signOut: true,
            update: true,
          },
        },
        event: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true,
          },
        },
        musician: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true,
          },
        },
        venue: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true,
          },
        },
        booking: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true,
          },
        },
        review: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true,
          },
        },
      },
      actions: {
        sendEmail: true,
        sendBookingEmails: true,
        testAction: true,
        simpleTest: true,
      },
    },
    musician: {
      storageKey: "musician",
      default: {
        read: true,
        action: true,
      },
      models: {
        user: {
          read: true,
          actions: {
            changePassword: true,
            signOut: true,
            update: true,
          },
        },
        musician: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true,
          },
        },
        event: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true,
          },
        },
        booking: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true,
          },
        },
        review: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true,
          },
        },
      },
    },
    venueOwner: {
      storageKey: "venue-owner",
      default: {
        read: true,
        action: true,
      },
      models: {
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
            delete: true,
          },
        },
        event: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true,
          },
        },
        booking: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true,
          },
        },
        review: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true,
          },
        },
      },
    },
  },
};
