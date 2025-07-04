import React, { useEffect } from "react";
import { useOutletContext } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import type { AuthOutletContext } from "./_app";

export default function VenueEventsPage() {
    const navigate = useNavigate();
    
    // Redirect to the workflow-based approach by default
    useEffect(() => {
        navigate('/venue-events/workflow-based', { replace: true });
    }, [navigate]);
    
    return null; // This component will redirect, so no UI needed
} 
