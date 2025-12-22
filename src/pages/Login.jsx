import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockUsersWithCredentials } from '../data/mockUsersCredentials';
import { Shield, AlertCircle, Eye, EyeOff } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Show loading while checking authentication
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#88bf47] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Find user by username
      const user = mockUsersWithCredentials.find(
        u => u.username.toLowerCase() === username.toLowerCase()
      );

      if (!user) {
        setError('Invalid username or password');
        setIsLoading(false);
        return;
      }

      // Check password
      if (user.password !== password) {
        setError('Invalid username or password');
        setIsLoading(false);
        return;
      }

      // Check if user is active
      if (user.status !== 'Active') {
        setError('Your account is inactive. Please contact administrator.');
        setIsLoading(false);
        return;
      }

      // Login successful
      await login(user);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#88bf47]/10 rounded-full mb-4">
            <Shield className="h-10 w-10 text-[#88bf47]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VIMS Admin Portal</h1>
          <p className="text-gray-600 text-sm">Vehicle Inspection Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
          <p className="text-gray-600 text-sm mb-6">Enter your credentials to access the system</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#88bf47] text-white py-3 rounded-lg font-semibold hover:bg-[#007c2d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2 font-semibold">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-gray-600 max-h-32 overflow-y-auto">
              <div><strong>Super Admin:</strong> superadmin / admin123</div>
              <div><strong>Security Admin:</strong> security / admin123</div>
              <div><strong>Audit Admin:</strong> audit / admin123</div>
              <div><strong>Regional Admin:</strong> admin.oromia / admin123</div>
              <div><strong>Zone Admin:</strong> admin.zone / admin123</div>
              <div><strong>Center Manager:</strong> manager.bole / admin123</div>
              <div><strong>Inspector:</strong> inspector / inspector123</div>
              <div><strong>Receptionist:</strong> receptionist / reception123</div>
              <div><strong>Viewer:</strong> viewer / viewer123</div>
              <div><strong>Enforcement:</strong> enforcement / enforce123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

