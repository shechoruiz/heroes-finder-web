import { CustomMenu } from "@/components/custom/CustomMenu";
import { Outlet } from "react-router";

// Un layout es un componente que envuelve a otros componentes. Basicamente es un diseño de interfaz que comparte el mismo estilo para todos los componentes que se encuentren dentro de el.
export const HeroesLayout = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <section className="max-w-7xl mx-auto p-6">
        <CustomMenu />
        <Outlet />
      </section>
    </section>
  );
};
