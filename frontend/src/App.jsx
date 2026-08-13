import { RouterProvider } from "react-router-dom";
import { publicRoutes } from "./routers";
// SIP/Asterisk is currently unavailable. Keep these imports for quick restore.
// import { useEffect } from "react";
// import { setIncomingCallHandler } from "./services/sipClientService";
// import { useCallStore } from "./context/callStore";
import { Suspense } from "react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
  </div>
);
function App() {
  // SIP/Asterisk is currently unavailable. Re-enable this block with the
  // imports above when incoming calls are supported again.
  // useEffect(() => {
  //   setIncomingCallHandler((invitation) => {
  //     useCallStore.getState().setIncomingCall(invitation);
  //   });
  // }, []);
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterProvider router={publicRoutes} />;
    </Suspense>
  );
}

export default App;
