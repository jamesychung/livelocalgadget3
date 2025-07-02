import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import { Link, useOutletContext } from 'react-router-dom';
import type { AuthOutletContext } from "./_app";

export default function MessagesPage() {
    const { user } = useOutletContext<AuthOutletContext>();

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" asChild>
                        <Link to="/musician-dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Messages</h1>
                        <p className="text-muted-foreground">
                            Communicate with venues and other musicians
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Content */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Messages
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Messages Coming Soon</h3>
                    <p className="text-muted-foreground mb-6">
                        The messaging system is currently under development. You'll be able to communicate with venues and other musicians soon.
                    </p>
                    <Button disabled>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
} 
