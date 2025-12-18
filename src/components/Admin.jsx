import { useEffect, useState } from 'react';
import { ScrollArea, Table, Button } from '@mantine/core';
import { supabase } from '../services/supabase.js'
import classes from '../css/TableScrollArea.module.css';
import cx from 'clsx';
import { format } from 'date-fns';

function Admin() {
    const [scrolled, setScrolled] = useState(false);
    const [clicks, setClicks] = useState([])

    const fetchClicks = async () => {
        try{
            const { data: { session } } = await supabase.auth.getSession();
            if(!session) throw new Error('No active session');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clicks`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,

                },
            })
            if(!response.ok) throw new Error("Error with endpoint response");
            const data = await response.json();
            setClicks(data)
        }catch(error){
            console.error('Error fetching all urls: ', error);
        }
    }

    const rows = clicks.map((element) => (
    <Table.Tr key={element.id}>
        <Table.Td><a href={ `${import.meta.env.VITE_API_URL}/${element.url_id}` } target="_blank" rel="noopener noreferrer">{import.meta.env.VITE_API_URL}/{element.url_id}</a></Table.Td>
        <Table.Td>{format(new Date(element.clicked_at), 'MM/dd/yyyy')}</Table.Td>
        <Table.Td>{element.user_agent ?? 'N/A'}</Table.Td>
        <Table.Td>{element.referrer ?? 'N/A'}</Table.Td>
        <Table.Td>{element.ip_address ?? 'N/A'}</Table.Td>
        <Table.Td>{element.browser ?? 'N/A'}</Table.Td>
        <Table.Td>{element.device_type ?? 'N/A'}</Table.Td>
        <Table.Td>{element.os ?? 'N/A'}</Table.Td>
        <Table.Td>{element.country ?? 'N/A'}</Table.Td>
        <Table.Td>{element.city ?? 'N/A'}</Table.Td>
        <Table.Td>{element.is_bot == null ? 'N/A' : element.is_bot ? 'Yes' : 'No'}</Table.Td>
    </Table.Tr>
    ));

    useEffect(() => {
        fetchClicks();
    }, [])

    return(
    <>
    <br />  
    <ScrollArea className={classes.scrollArea} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table miw={700} className={classes.table}>
            <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <Table.Tr>
                <Table.Th>URL</Table.Th>
                <Table.Th>Clicked on</Table.Th>
                <Table.Th>User Agent</Table.Th>
                <Table.Th>Referrer</Table.Th>
                <Table.Th>IP Address</Table.Th>
                <Table.Th>Browser</Table.Th>
                <Table.Th>Device Type</Table.Th>
                <Table.Th>Operating System</Table.Th>
                <Table.Th>Country</Table.Th>
                <Table.Th>City</Table.Th>
                <Table.Th>Is it a bot?</Table.Th>
            </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    </ScrollArea>
    </>
    )
}

export default Admin