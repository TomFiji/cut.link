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
    const admin_id = process.env.VITE_ADMIN_ID;

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
  

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  useEffect(() => {
        checkSignedIn();
    }, [])

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Group gap={5} visibleFrom="xs">
          <a
                key='Home'
                href='/'
                className={classes.link}
                data-active={active === '/' || undefined}
                onClick={(event) => {
                    event.preventDefault();
                    setActive('/');
                }}
                >
                {'Home'}
            </a>
             <a
                key={link.label}
                href={link.link}
                className={classes.link}
                data-active={active === link.link || undefined}
                onClick={(event) => {
                    event.preventDefault();
                    setActive(link.link);
                }}
                >
                {link.label}
            </a>
             <a
                key={link.label}
                href={link.link}
                className={classes.link}
                data-active={active === link.link || undefined}
                onClick={(event) => {
                    event.preventDefault();
                    setActive(link.link);
                }}
                >
                {link.label}
            </a>
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
export default Header