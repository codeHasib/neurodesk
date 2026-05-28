"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export const useInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvites = async () => {
    try {
      const res = await axios.get("/api/invitations/me");
      setInvitations(res.data);
    } catch (err) {
      console.error("Pulse_Sync_Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
    // Real-time Simulation: Sync every 10 seconds without refresh
    const interval = setInterval(fetchInvites, 10000);
    return () => clearInterval(interval);
  }, []);

  return { invitations, setInvitations, loading, refresh: fetchInvites };
};
