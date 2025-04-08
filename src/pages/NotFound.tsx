
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Página no encontrada</h2>
        <p className="text-gray-600 mb-6">
          Lo sentimos, no pudimos encontrar la página que estabas buscando.
          Puede que la dirección esté mal escrita o que la página haya sido movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <a href="/">Volver al inicio</a>
          </Button>
          <Button variant="outline" asChild size="lg">
            <a href="/dashboard">Ir al dashboard</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
