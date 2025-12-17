import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const AuthenticatedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                // Not signed in, redirect to login
                navigate('/signin');
            } else {
                setIsAuthenticated(true);
            }
            setLoading(false);
        };

        checkAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/signin');
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>; // Or your loading component
    }

    return isAuthenticated ? children : null;
};
export default AuthenticatedRoute