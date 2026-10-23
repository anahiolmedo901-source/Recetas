import { ChefHat, LogIn, LogOut, Menu, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const location = useLocation();
  const { user, isAuthLoading, signOut } = useAuth();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navClass = ({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-sage' : 'text-ink/60 hover:text-ink'}`;
  const displayName = user?.user_metadata?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'tu cuenta';

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSigningOut(false);
      setMenuOpen(false);
    }
  };

  return (
    <header className="relative z-30 border-b border-sage/10 bg-cream/90 backdrop-blur-md">
      <div className="page-shell flex h-[76px] items-center justify-between">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="miga, ir al inicio">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sage text-soft-white shadow-card transition group-hover:rotate-[-6deg]">
            <ChefHat size={21} strokeWidth={2.3} />
          </span>
          <span className="font-display text-[22px] font-extrabold tracking-[-0.06em] text-ink">miga<span className="text-coral">.</span></span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
          <NavLink to="/" end className={navClass}>Inicio</NavLink>
          <a href="/#recetas" className="text-sm font-semibold text-ink/60 transition hover:text-ink">Explorar recetas</a>
          <NavLink to="/registro" className={navClass}>Sobre miga</NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthLoading ? (
            <span className="text-sm font-semibold text-ink/40">Cargando...</span>
          ) : user ? (
            <>
              <span className="max-w-32 truncate text-sm font-semibold text-ink/60">Hola, {displayName}</span>
              <button type="button" onClick={handleSignOut} disabled={isSigningOut} className="inline-flex items-center gap-2 rounded-full border border-sage/15 px-4 py-2.5 text-sm font-bold text-sage transition hover:border-sage/35 hover:bg-soft-white disabled:opacity-50">
                <LogOut size={16} />
                {isSigningOut ? 'Saliendo...' : 'Salir'}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-full px-3 py-2.5 text-sm font-bold text-sage transition hover:text-ink">
                <LogIn size={16} />
                Entrar
              </Link>
              <Link to="/registro" className="inline-flex items-center gap-2 rounded-full border border-sage/15 px-4 py-2.5 text-sm font-bold text-sage transition hover:border-sage/35 hover:bg-soft-white">
                <UserRound size={16} />
                Crear cuenta
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-xl p-2 text-ink md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-sage/10 bg-cream px-5 py-5 shadow-soft md:hidden">
          <nav className="page-shell flex flex-col gap-5" aria-label="Navegación móvil">
            <NavLink to="/" end className={navClass}>Inicio</NavLink>
            <a href="/#recetas" className="text-sm font-semibold text-ink/60">Explorar recetas</a>
            <NavLink to="/registro" className={navClass}>Sobre miga</NavLink>
            {user ? (
              <button type="button" onClick={handleSignOut} disabled={isSigningOut} className="button-primary mt-1 w-full">
                <LogOut size={17} />
                {isSigningOut ? 'Saliendo...' : 'Cerrar sesión'}
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" className="button-secondary w-full"><LogIn size={17} /> Entrar</Link>
                <Link to="/registro" className="button-primary w-full"><UserRound size={17} /> Crear cuenta</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-sage/10 bg-soft-white">
      <div className="page-shell flex flex-col gap-5 py-8 text-sm text-ink/55 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 font-display font-extrabold text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sage text-soft-white"><ChefHat size={15} /></span>
          miga<span className="text-coral">.</span>
        </div>
        <p>Ideas para cocinar despacio y compartir rápido.</p>
        <p>Hecho con cariño · {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
