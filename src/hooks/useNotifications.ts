import { useState, useEffect } from 'react';
import { postulanteService } from '../services/postulanteService';

const STORAGE_KEY = 'suma_seen_statuses';

export const useNotifications = (isPostulante: boolean) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const getSeenStatuses = (): Record<string, string> => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  };

  const checkNotifications = async () => {
    if (!isPostulante) return;
    try {
      const applications = await postulanteService.getMyApplications();
      const seen = getSeenStatuses();
      
      let count = 0;
      applications.forEach((app: any) => {
        // Si nunca vimos esta app, o si el estado cambió desde la última vez
        if (!seen[app.id] || seen[app.id] !== app.status) {
          count++;
        }
      });
      
      setUnreadCount(count);
    } catch {
      // silencioso
    }
  };

  const markAllAsSeen = async () => {
    if (!isPostulante) return;
    try {
      const applications = await postulanteService.getMyApplications();
      const newSeen: Record<string, string> = {};
      applications.forEach((app: any) => {
        newSeen[app.id] = app.status;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSeen));
      setUnreadCount(0);
    } catch {
      // silencioso
    }
  };

  useEffect(() => {
    checkNotifications();
  }, [isPostulante]);

  return { unreadCount, markAllAsSeen };
};