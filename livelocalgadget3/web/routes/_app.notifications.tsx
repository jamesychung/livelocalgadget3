import React from "react";
import { useFindMany, useAction, useUser } from "@gadgetinc/react";
import { api } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Bell, MessageCircle, Calendar, User } from "lucide-react";
import { Link } from "react-router";

export default function NotificationsPage() {
  const user = useUser();
  const [markAsReadResult, markAsRead] = useAction(api.notification.update);

  const [{ data: notifications, fetching, error }] = useFindMany(api.notification, {
    filter: {
      user: { id: { equals: user?.id } },
      isActive: { equals: true }
    },
    sort: { createdAt: "Descending" }
  });

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead({
        id: notificationId,
        isRead: true
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_message":
        return <MessageCircle className="w-5 h-5" />;
      case "new_application":
        return <User className="w-5 h-5" />;
      case "booking_status_change":
        return <Calendar className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "new_message":
        return "bg-blue-100 text-blue-800";
      case "new_application":
        return "bg-green-100 text-green-800";
      case "booking_status_change":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (fetching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <div className="text-center text-red-500">
          Error loading notifications: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      
      {notifications && notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`${!notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        {!notification.isRead && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {new Date(notification.createdAt).toLocaleDateString()} at{" "}
                          {new Date(notification.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                        {notification.booking && (
                          <Link
                            to={`/app/venue-events`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No notifications</h3>
            <p className="text-gray-500">
              You're all caught up! New notifications will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 