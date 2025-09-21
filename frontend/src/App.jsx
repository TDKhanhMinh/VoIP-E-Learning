import { RouterProvider } from 'react-router-dom';
import "chart.js/auto";
import { publicRoutes } from './routers';

function App() {
  return (
    <RouterProvider router={publicRoutes} />
  );
}

export default App
