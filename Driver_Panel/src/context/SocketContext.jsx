import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../api/axios';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, driver } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastLocationUpdate, setLastLocationUpdate] = useState(null);
  const [lastBoardingUpdate, setLastBoardingUpdate] = useState(null);
  const [lastTripStatus, setLastTripStatus] = useState(null);
  const [activeSOSAlert, setActiveSOSAlert] = useState(null);

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const s = io(SOCKET_URL, {
      auth: { token },
      query: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    s.on('connect', () => {
      setIsConnected(true);
      console.log('[Socket] Connected to telemetry backend:', s.id);
      if (driver?._id) {
        s.emit('join:driver', { driverId: driver._id, vehicleNumber: driver.assignedBus });
      }
    });

    s.on('disconnect', () => {
      setIsConnected(false);
      console.log('[Socket] Disconnected from telemetry backend');
    });

    s.on('transport:location_update', (data) => {
      setLastLocationUpdate(data);
    });

    s.on('transport:boarding_update', (data) => {
      setLastBoardingUpdate(data);
    });

    s.on('transport:trip_status', (data) => {
      setLastTripStatus(data);
    });

    s.on('transport:sos_alert', (data) => {
      setActiveSOSAlert(data);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [token, driver?._id]);

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      lastLocationUpdate,
      lastBoardingUpdate,
      lastTripStatus,
      activeSOSAlert,
      clearSOSAlert: () => setActiveSOSAlert(null)
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
