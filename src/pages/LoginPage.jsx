import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signInUser } from '../services/auth';

function getLoginErrorMessage(error) {
  const message = error?.message?.toLowerCase() || '';
  if (message.includes('invalid login credentials')) return 'El correo o la contraseña no son correctos.';
  if (message.includes('email not confirmed')) return 'Confirma tu correo electrónico antes de iniciar sesión.';
  if (message.includes('supabase no esta configurado')) return 'Falta configurar Supabase en el archivo .env.';
  return 'No hemos podido iniciar sesión. Inténtalo de nuevo.';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signInUser(values);
      navigate(location.state?.from || '/', { replace: true });
    } catch (requestError) {
      setError(getLoginErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell py-10 sm:py-16">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-[34px] border border-sage/10 bg-soft-white shadow-soft lg:grid-cols-[.9fr_1.1fr]">
        <aside className="surface-grid relative overflow-hidden bg-sage p-7 text-soft-white sm:p-10 lg:p-12">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[28px] border-peach/20" />
          <div className="relative">
            <span className="eyebrow text-peach">Tu cocina, tus recetas</span>
            <h1 className="mt-7 max-w-sm font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.06em] sm:text-5xl">Vuelve a la mesa.</h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-soft-white/70">Tus favoritas te esperan. Entra para seguir descubriendo ideas que saben a casa.</p>
          </div>
        </aside>

        <div className="p-7 sm:p-10 lg:p-12">
          <span className="eyebrow">Iniciar sesión</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.05em] text-ink">Qué bueno verte<span className="text-coral">.</span></h2>
          <p className="mt-2 text-sm leading-6 text-ink/55">Entra para guardar y recuperar tus recetas favoritas.</p>

          {error && <div className="mt-6 rounded-2xl border border-coral/25 bg-coral/5 px-4 py-3 text-sm font-semibold text-coral" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="login-email" className="mb-2 block text-sm font-bold text-ink">Correo electrónico</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18} />
                <input id="login-email" name="email" type="email" value={values.email} onChange={updateField} required autoComplete="email" placeholder="hola@ejemplo.com" className="w-full rounded-2xl border border-sage/10 bg-cream px-11 py-3.5 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-sage/50" />
              </div>
            </div>
            <div>
              <label htmlFor="login-password" className="mb-2 block text-sm font-bold text-ink">Contraseña</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18} />
                <input id="login-password" name="password" type="password" value={values.password} onChange={updateField} required minLength={6} autoComplete="current-password" placeholder="Tu contraseña" className="w-full rounded-2xl border border-sage/10 bg-cream px-11 py-3.5 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-sage/50" />
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="button-primary w-full py-3.5">
              {isSubmitting ? 'Entrando...' : 'Iniciar sesión'}
              {!isSubmitting && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/55">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/registro" className="font-bold text-sage transition hover:text-coral">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
