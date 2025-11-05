import { RouterProvider } from 'react-router-dom';
import { publicRoutes } from './routers';
import { useEffect } from 'react';
import { setIncomingCallHandler } from './services/sipClientService';
import { useCallStore } from './context/callStore';

function App() {
  useEffect(() => {
    setIncomingCallHandler((invitation) => {
      useCallStore.getState().setIncomingCall(invitation);
    });
  }, []);
  return (
    <RouterProvider router={publicRoutes} />
  );
}

export default App
