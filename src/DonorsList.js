import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, Storage } from 'aws-amplify';
import {
    Button,
    Flex,
    Heading,
    Image,
    Text,
    View,
    Divider,
    withAuthenticator,
    Card,
    Collection,
} from '@aws-amplify/ui-react';
import { listNotes } from "./graphql/queries";

const DonorsList = ({ signOut }) => {
    const [notes, setNotes] = useState([]);
    useEffect(() => {
        fetchNotes();
    }, []);


    async function fetchNotes() {
        const apiData = await API.graphql({ query: listNotes });
        const notesFromAPI = apiData.data.listNotes.items;
        await Promise.all(
            notesFromAPI.map(async (note) => {
                if (note.image) {
                    const url = await Storage.get(note.name);
                    note.image = url;
                }
                return note;
            })
        );
        setNotes(notesFromAPI);
    }

    return (
        <View padding="1rem" margin="3rem">
            <Flex
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                alignContent="space-between"
                wrap="nowrap"
            >

                <Heading level={1}>Aviratha</Heading>
                <Button onClick={signOut}>Sign Out</Button>
            </Flex>

            <Divider
                orientation="horizontal" />

            <Flex
                direction={{ base: 'column', large: 'row' }}
                justifyContent="left"
                alignItems="left"
            >
                <Heading level={4}>Donors List</Heading>
                <Collection
                    type="list"
                    direction="column"
                    justifyContent="flex-start"
                    wrap="wrap"
                    items={notes}
                    gap="20px"
                >

                    {(item, index) => (
                        <Card key={index} padding="1rem">
                            <Heading level={4}>{item.name}</Heading>
                            <Text><b>Date: </b>{item.date}</Text>
                            <Text><b>Amount:</b> {item.amount}</Text>
                            <Text><b>Phone:</b> {item.phone}</Text>
                            <Text><b>Address: </b>{item.address}</Text>
                            <Text><b>Receipt No:</b> {item.receiptNo}</Text>
                            <Text><b>Reference Person:</b> {item.referencePerson}</Text>
                            <Text><b>PAN/Transaction Ref/ Bank Details:</b> {item.pan}</Text>
                            {item.image && (
                                <Image
                                    src={item.image}
                                    alt={`visual aid for ${item.name}`}
                                    backgroundColor="initial"
                                    height="40px"
                                    opacity="100%"
                                />
                            )}
                        </Card>
                    )}
                </Collection>
            </Flex>
        </View>
    );
};

export default withAuthenticator(DonorsList);