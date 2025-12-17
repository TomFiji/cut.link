// components/AdminRoute.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const AdminRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                // Not signed in at all
                navigate('/signin');
                return;
            }

            // Check if user is admin
            const { data: { user }, error } = await supabase.auth.getUser()


            if (error || !user) {
                // Not an admin, redirect to home or unauthorized page
                navigate('/'); // or '/'
            } else if (user.id == import.meta.env.VITE_ADMIN_ID){
                setIsAdmin(true);
            } else {setIsAdmin(false)}
            setLoading(false);
        };

        checkAdmin();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/signin');
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAdmin ? children : null;
};

export default AdminRoute