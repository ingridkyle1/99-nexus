import { useEffect, useState } from "react";
import {
  Home,
  TriangleAlert,
  Lightbulb,
  MapPin,
  BarChart3,
  Route,
  User,
} from "lucide-react";

// Cada item aponta para um id que EXISTE no App.jsx.
export const SECTIONS = [
  { id: "home", label: "Home", Icon: Home },
  { id: "problema", label: "Problema", Icon: TriangleAlert },
  { id: "solucao", label: "Solução", Icon: Lightbulb },
  { id: "mapa", label: "Mapa", Icon: MapPin },
  { id: "painel", label: "Painel", Icon: BarChart3 },
  { id: "jornada", label: "Jornada", Icon: Route },
  { id: "idealizadora", label: "Idealizadora", Icon: User },
];

function useActiveSection() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!els.length || !("IntersectionObserver" in window)) return;

    // A seção que cruza a "linha de leitura" no meio da tela é a ativa.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return active;
}

export default function Navbar() {
  const active = useActiveSection();
  const current = (id) => (active === id ? "page" : undefined);

  return (
    <>
      <nav className="navbar-desktop" aria-label="Navegação principal">
        <a href="#home" className="logo">
          99 Nexus
        </a>

        <div className="desktop-links">
          {SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={current(id)}
              className={active === id ? "is-active" : ""}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <nav className="navbar-mobile" aria-label="Navegação principal">
        {SECTIONS.map(({ id, label, Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={label}
            title={label}
            aria-current={current(id)}
            className={active === id ? "is-active" : ""}
          >
            <Icon size={18} aria-hidden="true" />
          </a>
        ))}
      </nav>
    </>
  );
}
