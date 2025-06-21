import type { GadgetPermissions } from "gadget-server";

/**
 * This metadata describes the access control configuration available in your application.
 * Grants that are not defined here are set to false by default.
 *
 * View and edit your roles and permissions in the Gadget editor at https://livelocalgadget3.gadget.app/edit/settings/permissions
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
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
            updateRole: true,
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
    user: {
      storageKey: "user",
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
            updateRole: true,
          },
        },
        event: {
          read: true,
        },
        musician: {
          read: true,
        },
        venue: {
          read: true,
        },
        booking: {
          read: true,
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
            updateRole: true,
          },
        },
        musician: {
          read: true,
          actions: {
            create: true,
            update: true,
            delete: true
          },
        },
        event: {
          read: true,
          actions: {
            create: {
              filter: "accessControl/filters/event/musician.gelly",
            },
            update: {
              filter: "accessControl/filters/event/musician.gelly",
            },
          },
        },
        booking: {
          read: true,
          actions: {
            create: true,
            update: true,
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
            updateRole: true,
          },
        },
        venue: {
          read: true,
          actions: {
            create: {
              filter: "accessControl/filters/venue/owner.gelly",
            },
            update: {
              filter: "accessControl/filters/venue/owner.gelly",
            },
            delete: {
              filter: "accessControl/filters/venue/owner.gelly",
            },
          },
        },
        event: {
          read: true,
          actions: {
            create: {
              filter: "accessControl/filters/event/venue.gelly",
            },
            update: {
              filter: "accessControl/filters/event/venue.gelly",
            },
          },
        },
        booking: {
          read: true,
          actions: {
            create: true,
            update: true,
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
    eventOrganizer: {
      storageKey: "event-organizer",
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
            updateRole: true,
          },
        },
        event: {
          read: true,
          actions: {
            create: {
              filter: "accessControl/filters/event/organizer.gelly",
            },
            update: {
              filter: "accessControl/filters/event/organizer.gelly",
            },
            delete: {
              filter: "accessControl/filters/event/organizer.gelly",
            },
          },
        },
        booking: {
          read: true,
          actions: {
            create: true,
            update: true,
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
        action: false
      },
      models: {
        user: {
          read: true,
          actions: {
            changePassword: true,
            signOut: true,
            update: true,
          }
        },
        musician: {
          read: true,
          actions: {
            create: true,
            update: true
          }
        },
        venue: {
          read: true,
        },
        booking: {
          read: true,
        },
        event: {
          read: true,
        },
      }
    },
    unauthenticated: {
      storageKey: "unauthenticated",
      models: {
        user: {
          actions: {
            resetPassword: true,
            sendResetPassword: true,
            sendVerifyEmail: true,
            signIn: true,
            signUp: true,
            verifyEmail: true,
          },
        },
        event: {
          read: true,
        },
        musician: {
          read: true,
        },
        venue: {
          read: true,
        },
        review: {
          read: true,
        },
      },
    },
  },
};
