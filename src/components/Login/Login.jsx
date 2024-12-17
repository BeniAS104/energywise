import { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { database } from '../../firebase';
import './Login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Please enter your password';
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors({}); // Clear previous errors
    
    if (!validateForm()) return;

    try {
      if (isLogin) {
        console.log('Attempting login with:', formData.email); // Debug log
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        console.log('Attempting signup with:', formData.email); // Debug log
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // Create initial user record in database
        const userRef = ref(database, `users/${userCredential.user.uid}`);
        await set(userRef, {
            hasCompletedOnboarding: false
        });
        
        setSuccessMessage('Account created successfully! You can now log in with your credentials.');
        setIsLogin(true);
      }
    } catch (err) {
      // Enhanced error logging
      console.error('Firebase auth error:', {
        code: err.code,
        message: err.message,
        fullError: err
      });

      // More specific error handling
      if (err.code === 'auth/user-not-found') {
        setErrors({
          submit: 'No account exists with this email address. Please sign up first.',
          email: 'Email not registered' // Additional field-specific error
        });
      } else if (err.code === 'auth/wrong-password') {
        setErrors({
          submit: 'Incorrect password. Please try again or use "Forgot Password".',
          password: 'Invalid password' // Additional field-specific error
        });
      } else if (err.code === 'auth/invalid-credential') {
        setErrors({
          submit: 'Invalid email or password. Please check your credentials and try again.'
        });
      } else {
        setErrors({
          submit: `Authentication error: ${err.code || 'unknown error'}`
        });
      }
    }
  };

  return (
    <div className="login-container" role="main">
      <div className="login-content">
        <div className="login-header" role="banner">
          <img src="logopure.png" alt="Energywise logo" className="logologin" />
          <h1>Energywise</h1>
          <p className="tagline" role="contentinfo">Smart energy monitoring for a sustainable future</p>
        </div>

        <div className="login-box" role="region" aria-labelledby="auth-title">
          <h2 id="auth-title">{isLogin ? 'Log In' : 'Create your Account'}</h2>
          
          {successMessage && (
            <p className="success-message" role="alert" aria-live="polite">
              {successMessage}
            </p>
          )}
          
          {errors.submit && (
            <div className="error-container" role="alert" aria-live="assertive">
              <p className="error-message">{errors.submit}</p>
              {isLogin && errors.email === 'Email not registered' && (
                <button 
                  className="switch-auth-mode"
                  onClick={() => setIsLogin(false)}
                  aria-label="Switch to create account form"
                >
                  Create an account instead
                </button>
              )}
            </div>
          )}
          
          <form onSubmit={handleSubmit} role="form" aria-label={isLogin ? 'Login form' : 'Sign up form'}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className={errors.email ? 'error' : ''}
                required
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <span className="field-error" id="email-error" role="alert">
                  {errors.email}
                </span>
              )}
            </div>
            
            <div className="form-group">
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={errors.password ? 'error' : ''}
                required
                aria-required="true"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <span className="field-error" id="password-error" role="alert">
                  {errors.password}
                </span>
              )}
            </div>

            {!isLogin && (
              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className={errors.confirmPassword ? 'error' : ''}
                  required
                  aria-required="true"
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                />
                {errors.confirmPassword && (
                  <span className="field-error" id="confirm-password-error" role="alert">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            )}
            
            <button 
              type="submit" 
              className="submit-button"
              aria-label={isLogin ? 'Log in to your account' : 'Create new account'}
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          
          <p className="toggle-form">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              className="signup-button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ email: '', password: '', confirmPassword: '' });
                setErrors({});
                setSuccessMessage('');
              }}
              aria-label={isLogin ? 'Switch to sign up form' : 'Switch to login form'}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 