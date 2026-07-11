import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiCalendarEventLine, RiFlashlightLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';

interface FormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? '/';
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    setValue('email', 'demo@eventexplorer.com');
    setValue('password', 'demo1234');
    toast('Demo credentials filled in — hit Login!', { icon: '🚀' });
  };

  const fillAdmin = () => {
    setValue('email', 'admin@eventexplorer.com');
    setValue('password', 'admin123');
    toast('Admin credentials filled in!', { icon: '🔑' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', position: 'relative' }}>
      {/* BG glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(139,92,246,0.07) 0%, transparent 70%)' }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RiCalendarEventLine style={{ color: 'white', fontSize: '20px' }} />
            </div>
            <span className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f0eeff' }}>
              Event<span className="gradient-text">Explorer</span>
            </span>
          </Link>
        </div>

        <div className="glass-card" style={{ borderRadius: '1.25rem', padding: '2rem' }}>
          <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem', textAlign: 'center' }}>Welcome back</h1>
          <p style={{ textAlign: 'center', color: 'rgba(240,238,255,0.4)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
            Sign in to your account to continue
          </p>

          {/* Demo shortcuts */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={fillDemo}
              style={{
                flex: 1, padding: '0.55rem 0.75rem', borderRadius: '0.5rem',
                background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                color: '#C4B5FD', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
              }}
            >
              <RiFlashlightLine /> Demo Login
            </button>
            <button
              type="button"
              onClick={fillAdmin}
              style={{
                flex: 1, padding: '0.55rem 0.75rem', borderRadius: '0.5rem',
                background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)',
                color: '#F9A8D4', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
              }}
            >
              🔑 Admin Login
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <hr className="divider" style={{ flex: 1 }} />
            <span style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.25)', whiteSpace: 'nowrap' }}>or sign in with email</span>
            <hr className="divider" style={{ flex: 1 }} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label-text">Email Address</label>
              <div style={{ position: 'relative' }}>
                <RiMailLine style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,238,255,0.3)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input-field"
                  style={{ paddingLeft: '2.25rem' }}
                  {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })}
                />
              </div>
              {errors.email && <div className="error-text">{errors.email.message}</div>}
            </div>

            <div>
              <label className="label-text">Password</label>
              <div style={{ position: 'relative' }}>
                <RiLockLine style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,238,255,0.3)', pointerEvents: 'none' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Your password"
                  className="input-field"
                  style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }}
                  {...register('password', { required: 'Password is required', minLength: { value: 3, message: 'Password must be at least 3 characters' } })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(240,238,255,0.35)', cursor: 'pointer', padding: 0 }}
                >
                  {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
              {errors.password && <div className="error-text">{errors.password.message}</div>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem', opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'rgba(240,238,255,0.4)', marginTop: '1.5rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#F9A8D4', textDecoration: 'none', fontWeight: 600 }}>Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
