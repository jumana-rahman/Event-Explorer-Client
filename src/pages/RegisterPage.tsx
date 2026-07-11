import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RiMailLine, RiLockLine, RiUser3Line, RiImageLine, RiEyeLine, RiEyeOffLine, RiCalendarEventLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  image: string;
}

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();
  const password = watch('password', '');

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      await registerUser(data.name, data.email, data.password, data.image);
      toast.success('Account created! Welcome to Event Explorer 🎉');
      navigate('/dashboard');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 50% at 70% 40%, rgba(236,72,153,0.07) 0%, transparent 70%)' }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
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
          <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem', textAlign: 'center' }}>Create account</h1>
          <p style={{ textAlign: 'center', color: 'rgba(240,238,255,0.4)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
            Join thousands of event-goers and organizers
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label-text">Full Name</label>
              <div style={{ position: 'relative' }}>
                <RiUser3Line style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,238,255,0.3)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  placeholder="Alex Rivera"
                  className="input-field"
                  style={{ paddingLeft: '2.25rem' }}
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
                />
              </div>
              {errors.name && <div className="error-text">{errors.name.message}</div>}
            </div>

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
                  placeholder="Min. 6 characters"
                  className="input-field"
                  style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(240,238,255,0.35)', cursor: 'pointer', padding: 0 }}>
                  {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
              {errors.password && <div className="error-text">{errors.password.message}</div>}
            </div>

            <div>
              <label className="label-text">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <RiLockLine style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,238,255,0.3)', pointerEvents: 'none' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  className="input-field"
                  style={{ paddingLeft: '2.25rem' }}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === password || 'Passwords do not match',
                  })}
                />
              </div>
              {errors.confirmPassword && <div className="error-text">{errors.confirmPassword.message}</div>}
            </div>

            <div>
              <label className="label-text">Profile Photo URL <span style={{ color: 'rgba(240,238,255,0.25)' }}>(optional)</span></label>
              <div style={{ position: 'relative' }}>
                <RiImageLine style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,238,255,0.3)', pointerEvents: 'none' }} />
                <input
                  type="url"
                  placeholder="https://..."
                  className="input-field"
                  style={{ paddingLeft: '2.25rem' }}
                  {...register('image')}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem', opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'rgba(240,238,255,0.4)', marginTop: '1.5rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#F9A8D4', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
