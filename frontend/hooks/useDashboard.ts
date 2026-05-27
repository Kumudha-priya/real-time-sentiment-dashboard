"use client";
import { useEffect, useState, useCallback } from "react";
import { fetchAnalytics } from "@/services/api";
import { AnalyticsResponse } from "@/lib/types";

export const useDashboard = () => {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);

      const res = await fetchAnalytics();
      setData(res);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await fetchAnalytics();

        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load dashboard data");
          setLoading(false);
        }
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return {
    data,
    loading,
    error,
    retry: loadData,
  };
};