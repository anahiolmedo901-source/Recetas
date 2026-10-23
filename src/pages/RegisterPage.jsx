import { Check, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/auth';

const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function validate(values) {
  const nextErrors = {};
  if (!values.name.trim()) nextErrors.name = 'Escribe tu nombre.';
  if (!values.email.trim()) nextErrors.email = 'Escribe tu correo electrónico.';
  else if (!/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = 'Introduce un correo válido.';
  if (values.password.length < 6) nextErrors.password = 'Usa al menos 6 caracteres.';
  if (values.confirmPassword !== values.password) nextErrors.confirmPassword = 'Las contraseñas no coinciden.';
  return nextErrors;
}

function getRegisterErrorMessage(error) {
  const message = error?.message?.toLowerCase() || '';
  if (message.includes('already registered')) return 'Este correo ya tiene una cuenta. Prueba a iniciar sesión.';
  if (message.includes('rate limit')) return 'Se ha alcanzado el límite de correos. Espera unos minutos e inténtalo de nuevo.';
  if (message.includes('supabase no esta configurado')) return 'Falta configurar Supabase en el archivo .env.';
  return 'No hemos podido crear tu cuenta. Comprueba los datos e inténtalo de nuevo.';
}

function Field({ label, name, type = 'text', value, onChange, onBlur, error, icon: Icon, children }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-bold text-ink">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18} />
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required
          minLength={name === 'password' || name === 'confirmPassword' ? 6 : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full rounded-2xl border bg-cream px-11 py-3.5 text-sm text-ink outline-none transition placeholder:text-ink/35 ${error ? 'border-coral/70 focus:border-coral' : 'border-sage/10 focus:border-sage/50'}`}
          placeholder={name === 'name' ? 'Tu nombre' : name === 'email' ? 'hola@ejemplo.com' : 'Mínimo 6 caracteres'}
        />
        {children}
      </div>
      {error && <p id={`${name}-error`} className="mt-1.5 text-xs font-semibold text-coral">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };
    const nextErrors = validate(nextValues);
    setValues(nextValues);
    setErrors(nextErrors);
    setStatus(null);
  };

  const markTouched = (event) => {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (Object.keys(nextErrors).length) {
      setStatus({ type: 'error', message: 'Revisa los campos marcados antes de continuar.' });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const { session } = await registerUser({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      setStatus({
        type: 'success',
        message: session
          ? 'Tu cuenta esta lista. Bienvenido a la mesa.'
          : 'Cuenta creada. Revisa tu correo para confirmar la cuenta antes de entrar.',
      });
      setValues(initialValues);
      setErrors({});
      setTouched({});
    } catch (error) {
      setStatus({ type: 'error', message: getRegisterErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell py-10 sm:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[34px] border border-sage/10 bg-soft-white shadow-soft lg:grid-cols-[.85fr_1.15fr]">
        <aside className="surface-grid relative overflow-hidden bg-sage p-7 text-soft-white sm:p-10 lg:p-12">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[28px] border-peach/20" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full border-[34px] border-soft-white/10" />
          <div className="relative flex h-full flex-col">
            <span className="eyebrow text-peach"><UserRound size={15} /> Un sitio para ti</span>
            <h1 className="mt-7 max-w-sm font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.06em] sm:text-5xl">Una buena receta empieza con ganas.</h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-soft-white/70">Crea tu cuenta para guardar ideas, volver a tus favoritas y hacer de la cocina tu lugar preferido.</p>
            <div className="mt-auto hidden space-y-4 pt-16 lg:block">
              {['Guarda tus recetas favoritas', 'Descubre ideas según tu momento', 'Cocina a tu propio ritmo'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold text-soft-white/85">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-peach/25 text-peach"><Check size={14} strokeWidth={3} /></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="p-7 sm:p-10 lg:p-12">
          <div className="mb-8">
            <span className="eyebrow">Crear cuenta</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.05em] text-ink">Bienvenido a miga<span className="text-coral">.</span></h2>
            <p className="mt-2 text-sm leading-6 text-ink/55">Solo necesitamos unos datos para preparar tu espacio.</p>
          </div>

          {status && (
            <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-semibold ${status.type === 'success' ? 'border-sage/20 bg-sage-light text-sage' : 'border-coral/25 bg-coral/5 text-coral'}`} role="status">
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <Field label="Nombre" name="name" value={values.name} onChange={updateField} onBlur={markTouched} error={touched.name ? errors.name : ''} icon={UserRound} />
            <Field label="Correo electrónico" name="email" type="email" value={values.email} onChange={updateField} onBlur={markTouched} error={touched.email ? errors.email : ''} icon={Mail} />
            <Field label="Contraseña" name="password" type={showPassword ? 'text' : 'password'} value={values.password} onChange={updateField} onBlur={markTouched} error={touched.password ? errors.password : ''} icon={LockKeyhole}>
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink/40 hover:text-sage" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </Field>
            <Field label="Confirmar contraseña" name="confirmPassword" type={showConfirmation ? 'text' : 'password'} value={values.confirmPassword} onChange={updateField} onBlur={markTouched} error={touched.confirmPassword ? errors.confirmPassword : ''} icon={LockKeyhole}>
              <button type="button" onClick={() => setShowConfirmation((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink/40 hover:text-sage" aria-label={showConfirmation ? 'Ocultar confirmación' : 'Mostrar confirmación'}>
                {showConfirmation ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </Field>
            <p className="pt-1 text-xs leading-5 text-ink/45">Al registrarte aceptas recibir inspiración ocasional para cocinar mejor, nunca spam.</p>
            <button type="submit" disabled={isSubmitting} className="button-primary w-full py-3.5">
              {isSubmitting ? 'Creando tu cuenta...' : 'Crear mi cuenta'}
            </button>
            <p className="text-center text-sm text-ink/55">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-bold text-sage transition hover:text-coral">Inicia sesión</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
