import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Generic hook for fetching data from Supabase
export function useSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T[] | null; error: any }>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await queryFn();
        
        if (mounted) {
          if (result.error) {
            setError(result.error);
          } else {
            setData(result.data);
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}

// Hook for fetching a single record
export function useSupabaseQuerySingle<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await queryFn();
        
        if (mounted) {
          if (result.error) {
            setError(result.error);
          } else {
            setData(result.data);
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}

// Hook for mutations (insert, update, delete)
export function useSupabaseMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = async (mutationFn: () => Promise<any>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn();
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

// Specific hooks for common operations
export function useMusicians(filter?: any) {
  return useSupabaseQuery(
    async () => {
      let query = supabase.from('musicians').select('*');
      
      if (filter?.user?.id?.equals) {
        query = query.eq('user_id', filter.user.id.equals);
      }
      
      return await query;
    },
    [filter]
  );
}

export function useVenues(filter?: any) {
  return useSupabaseQuery(
    async () => {
      let query = supabase.from('venues').select('*');
      
      if (filter?.user?.id?.equals) {
        query = query.eq('user_id', filter.user.id.equals);
      }
      
      return await query;
    },
    [filter]
  );
}

export function useEvents(filter?: any) {
  return useSupabaseQuery(
    async () => {
      let query = supabase.from('events').select('*');
      
      if (filter?.venue?.id?.equals) {
        query = query.eq('venue_id', filter.venue.id.equals);
      }
      
      return await query;
    },
    [filter]
  );
}

export function useBookings(filter?: any) {
  return useSupabaseQuery(
    async () => {
      let query = supabase.from('bookings').select(`
        *,
        venue:venues(*),
        musician:musicians(*)
      `);
      
      if (filter?.musician?.id?.equals) {
        query = query.eq('musician_id', filter.musician.id.equals);
      }
      
      if (filter?.venue?.id?.equals) {
        query = query.eq('venue_id', filter.venue.id.equals);
      }
      
      return await query;
    },
    [filter]
  );
}

// Hook for user profile
export function useUserProfile(userId?: string) {
  return useSupabaseQuerySingle(
    async () => {
      if (!userId) return { data: null, error: null };
      return await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
    },
    [userId]
  );
}

// Hook for musician profile
export function useMusicianProfile(userId?: string) {
  return useSupabaseQuerySingle(
    async () => {
      if (!userId) return { data: null, error: null };
      return await supabase
        .from('musicians')
        .select('*')
        .eq('user_id', userId)
        .single();
    },
    [userId]
  );
}

// Hook for venue profile
export function useVenueProfile(userId?: string) {
  return useSupabaseQuerySingle(
    async () => {
      if (!userId) return { data: null, error: null };
      return await supabase
        .from('venues')
        .select('*')
        .eq('user_id', userId)
        .single();
    },
    [userId]
  );
} 