import { RouterProvider } from 'react-router-dom';
import { publicRoutes } from './routers';

function App() {
  return (
    <RouterProvider router={publicRoutes} />
  );
}

export default App
