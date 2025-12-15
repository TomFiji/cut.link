import { useEffect, useState } from 'react';
import { Burger, Container, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase'
import classes from '../css/HeaderSimple.module.css';

const links = [
  { link: '/', label: 'Home' },
  { link: '/all-urls', label: 'Your Links' },
  { link: '/admin', label: 'Admin' },
];

function Header() {
    const [opened, { toggle }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);
    const [isSignedIn, setIsSignedIn] = useState(null)
    const [isAdmin, setIsAdmin] = useState(null)

    const navigate = useNavigate()
    const admin_id = import.meta.env.VITE_ADMIN_ID;

    async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.log('Error signing out: ', error)
    } else {
        // Clear all browser storage to ensure no cached data persists
        localStorage.clear();
        sessionStorage.clear();
        navigate("/signin")
    }
    } 

    async function checkSignedIn() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        console.log("User is not signed in")
        setIsSignedIn(false)
    }
    else{
        console.log("User found: ", user.email)
        setIsSignedIn(true)
        checkIfAdmin(user)
    }
    }

    async function checkIfAdmin(user) {

        if (user.id!=admin_id) {
            console.log("User is not admin")
            setIsAdmin(false)
        }
        else{
            console.log("User is admin")
            setIsAdmin(true)
        }
    
    }
  

  useEffect(() => {
        // Check auth state on mount
        checkSignedIn();

        // Listen for auth state changes (login, logout, signup)
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("Auth state changed:", event);
            if (session?.user) {
                setIsSignedIn(true);
                checkIfAdmin(session.user);
            } else {
                setIsSignedIn(false);
                setIsAdmin(false);
            }
        });

        // Cleanup listener on unmount
        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, [])

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Group gap={5} visibleFrom="xs">
          <a
                key='home'
                href='/'
                className={classes.link}
                data-active={active === '/' || undefined}
                onClick={(event) => {
                    event.preventDefault();
                    setActive('/');
                    navigate('/');
                }}
                >
                {'Home'}
            </a>
            {isSignedIn === true && (
            <a
                key='your-links'
                href='/all-urls'
                className={classes.link}
                data-active={active === '/all-urls' || undefined}
                onClick={(event) => {
                    event.preventDefault();
                    setActive('/all-urls');
                    navigate('/all-urls');
                }}
                >
                {'Your Links'}
            </a> )}
            {isAdmin === true && (
            <a
                key='admin'
                href='/admin'
                className={classes.link}
                data-active={active === '/admin' || undefined}
                onClick={(event) => {
                    event.preventDefault();
                    setActive('/admin');
                    navigate('/admin');
                }}
                >
                {'Admin'}
            </a> )}
        </Group>
        <Group className={classes.signInOutButton}>
            {isSignedIn === true && (
              <a
              key='logout-button'
              className={classes.buttonLink}
              onClick={(event) => {
                  event.preventDefault();
                  signOut()
                  navigate('/admin');
              }}
              >
              {'Log out'}
              </a>
            )}
            {isSignedIn === false && (
              <>
              <a
                key='sign-up'
                href='/signup'
                className={classes.buttonLink}
                onClick={(event) => {
                    event.preventDefault();
                    setActive('/signup');
                    navigate('/signup');
                }}
                >
                {'Sign Up'}
              </a>
              <a
                key='log-in'
                href='/signin'
                className={classes.buttonLink}
                onClick={(event) => {
                    event.preventDefault();
                    setActive('/signin');
                    navigate('/signin');
                }}
                >
                {'Log in'}
              </a>
              </>
            )}
        </Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
export default Header