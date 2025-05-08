import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserType } from '../types';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getProfile, updateProfile } from '../lib/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, userType: UserType) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session?.user) {
          const profile = await getProfile(session.access_token);
          
          if (!profile) {
            setState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'Profile not found',
            });
            return;
          }

          setState({
            user: profile,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Authentication check failed',
        });
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const profile = await getProfile(session.access_token);
          
          if (!profile) {
            setState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'Profile not found',
            });
            return;
          }

          setState({
            user: profile,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Profile fetch error:', error);
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Failed to fetch user profile',
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (session) {
        const profile = await getProfile(session.access_token);
        
        if (!profile) {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Profile not found',
          });
          return;
        }

        setState({
          user: profile,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        if (profile.userType === 'student') {
          navigate('/student/dashboard');
        } else if (profile.userType === 'company') {
          navigate('/company/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Invalid email or password',
      }));
    }
  };

  const register = async (email: string, password: string, name: string, userType: UserType) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data: { session }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        if (signUpError.message === 'User already registered') {
          throw new Error('このメールアドレスは既に登録されています。');
        }
        throw signUpError;
      }
      
      if (!session) throw new Error('Registration failed: No session returned');

      const profile = {
        id: session.user.id,
        email,
        name,
        user_type: userType, // Use snake_case for Supabase
        ...(userType === 'student' ? {
          university: '',
          major: '',
          graduation_year: new Date().getFullYear() + 4,
        } : {
          company_name: name,
          industry: '',
        }),
      };

      const updatedProfile = await updateProfile(session.access_token, profile);
      
      if (!updatedProfile) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to create user profile',
        });
        return;
      }

      setState({
        user: updatedProfile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      if (userType === 'student') {
        navigate('/student/profile');
      } else if (userType === 'company') {
        navigate('/company/profile');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Registration failed',
      }));
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to logout',
      }));
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const updatedProfile = await updateProfile(session.access_token, userData);
      
      if (!updatedProfile) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to update user profile',
        }));
        return;
      }

      setState({
        ...state,
        user: updatedProfile,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Update user error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to update user information',
      }));
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};