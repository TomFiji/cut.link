import { useEffect, useState } from 'react';
import { ScrollArea, Table, Button } from '@mantine/core';
import { supabase } from '../services/supabase.js'
import classes from '../css/TableScrollArea.module.css';
import cx from 'clsx';
import { format } from 'date-fns';


function UserUrlsTable(){

    const [scrolled, setScrolled] = useState(false);
    const [urls, setUrls] = useState([])

    const fetchUrls = async () => {
        try{
            const { data: { session } } = await supabase.auth.getSession();
            if(!session) throw new Error('No active session');
            console.log(session)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/urls/allUrls`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,

                },
            })
            if(!response.ok) throw new Error("This is what you're seeing");
            const data = await response.json();
            setUrls(data)
        }catch(error){
            console.error('Error fetching all urls: ', error);
        }
    }

    const rows = urls.map((element) => (
    <Table.Tr key={element.id}>
        <Table.Td>{element.description}</Table.Td>
        <Table.Td>{element.short_url}</Table.Td>
        <Table.Td>{element.clicks}</Table.Td>
        <Table.Td>{format(new Date(element.created_at), 'MM/dd/yyyy')}</Table.Td>
    </Table.Tr>
    ));

    useEffect(() => {
        fetchUrls();
    }, [])

    return(
    <ScrollArea className={classes.scrollArea} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table miw={700} className={classes.table}>
            <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <Table.Tr>
                <Table.Th>Description</Table.Th>
                <Table.Th>URL</Table.Th>
                <Table.Th>Amount of Clicks</Table.Th>
                <Table.Th>Created on</Table.Th>
                <Table.Th> </Table.Th>
            </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    </ScrollArea>
    )
}

export default UserUrlsTable