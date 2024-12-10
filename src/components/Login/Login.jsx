import { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
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
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation (only for signup)
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
    
    if (!validateForm()) return;

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        setSuccessMessage('Account created successfully! You can now log in.');
        setIsLogin(true);
      }
    } catch (err) {
      const errorMessage = getFirebaseErrorMessage(err.code);
      setErrors({ submit: errorMessage });
    }
  };

  const getFirebaseErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <h1>energywise.</h1>
          <p className="tagline">Smart energy monitoring for a sustainable future</p>
        </div>

        <div className="login-box">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
          {errors.submit && (
            <p className="error-message">{errors.submit}</p>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className={errors.email ? 'error' : ''}
                required
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={errors.password ? 'error' : ''}
                required
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            {!isLogin && (
              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className={errors.confirmPassword ? 'error' : ''}
                  required
                />
                {errors.confirmPassword && (
                  <span className="field-error">{errors.confirmPassword}</span>
                )}
              </div>
            )}
            
            <button type="submit" className="submit-button">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          
          <p className="toggle-form">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              className="toggle-button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ email: '', password: '', confirmPassword: '' });
                setErrors({});
                setSuccessMessage('');
              }}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 