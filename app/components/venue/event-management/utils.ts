import React from "react";
import { Badge } from "../../../components/ui/badge";
import { supabase } from "../../../lib/supabase";
import { Event, Booking, EditFormData } from "./types";

/**
 * Fetches event data from Supabase
 * @param eventId The ID of the event to fetch
 * @returns Object containing event data or error
 */
export const fetchEventData = async (eventId: string): Promise<{ data: Event | null, error: any }> => {
  try {
    if (!eventId) return { data: null, error: "No event ID provided" };
    
    const { data: eventData, error } = await supabase
      .from('events')
      .select(`
        *,
        venue:venues (
          id, 
          name, 
          address,
          city,
          state,
          zip_code,
          phone,
          email,
          website
        )
      `)
      .eq('id', eventId)
      .single();
      
    if (error) {
      console.error("Error fetching event:", error);
      return { data: null, error };
    }
    
    return { data: eventData, error: null };
  } catch (error) {
    console.error("Error fetching event:", error);
    return { data: null, error };
  }
};

/**
 * Fetches bookings data from Supabase
 * @param eventId The ID of the event to fetch bookings for
 * @returns Object containing bookings data or error
 */
export const fetchBookingsData = async (eventId: string): Promise<{ data: Booking[] | null, error: any }> => {
  try {
    if (!eventId) return { data: null, error: "No event ID provided" };
    
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        event:events (
          id,
          title,
          date,
          start_time,
          end_time,
          description,
          created_at
        ),
        musician:musicians (
          id,
          stage_name,
          genre,
          city,
          state,
          phone,
          email,
          hourly_rate,
          profile_picture
        )
      `)
      .eq('event_id', eventId);
    
    if (error) {
      console.error("Error fetching bookings:", error);
      return { data: null, error };
    }
    
    return { data: bookings || [], error: null };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return { data: null, error };
  }
};

/**
 * Creates edit form data from event data
 * @param event The event data to create form data from
 * @returns Form data object
 */
export const createEditFormData = (event: Event): EditFormData => {
  // Handle date conversion properly for timezone
  let dateString = "";
  if (event.date) {
    let localDate: Date;
    
    // Handle different date formats
    if (Object.prototype.toString.call(event.date) === '[object Date]') {
      // If it's already a Date object
      localDate = event.date as Date;
    } else if (typeof event.date === 'string') {
      // If it's a string, parse it
      localDate = new Date(event.date);
    } else {
      // Fallback
      localDate = new Date(String(event.date));
    }
    
    // Format as YYYY-MM-DD for the date input
    dateString = localDate.toLocaleDateString('en-CA'); // en-CA gives YYYY-MM-DD format
  }
  
  return {
    title: event.title || "",
    description: event.description || "",
    date: dateString,
    startTime: event.start_time || "",
    endTime: event.end_time || "",
    ticketPrice: event.ticket_price ? event.ticket_price.toString() : "",
    totalCapacity: event.total_capacity ? event.total_capacity.toString() : "",
    status: event.status || "",
    genres: event.genres || []
  };
};

/**
 * Gets the event status based on bookings
 * @param event The event data
 * @param bookings The bookings data
 * @returns Status string
 */
export const getEventStatus = (event: Event, bookings: Booking[]): string => {
  if (event?.musician) return "confirmed";
  if (bookings.some(b => b.status === "communicating")) return "communicating";
  if (bookings.some(b => b.status === "applied")) return "pending";
  return "open";
};

/**
 * Updates a booking status
 * @param bookingId The ID of the booking to update
 * @param status The new status
 * @returns Object containing result or error
 */
export const updateBookingStatus = async (
  bookingId: string, 
  status: string
): Promise<{ data: any, error: any }> => {
  try {
    const updateData: any = { status };
    
    // Add timestamp based on status
    if (status === "selected") {
      updateData.selected_at = new Date().toISOString();
    } else if (status === "confirmed") {
      updateData.confirmed_at = new Date().toISOString();
    } else if (status === "rejected") {
      updateData.rejected_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId);
    
    if (error) {
      console.error(`Error updating booking to ${status}:`, error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error updating booking to ${status}:`, error);
    return { data: null, error };
  }
}; 