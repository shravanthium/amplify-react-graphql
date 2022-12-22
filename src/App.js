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
  TextField,
  View,
  Divider,
  withAuthenticator,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
} from '@aws-amplify/ui-react';
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";

const App = ({ signOut }) => {
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

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      referencePerson: form.get("referencePerson"),
      pan: form.get("pan"),
      amount: form.get("amount"),
      receiptNo: form.get("receiptNo"),
      phone: form.get("phone"),
      date: form.get("date"),
      address: form.get("address"),
      image: image.name,
    };
    if (!!data.image) await Storage.put(data.name, image);
    console.log(data);
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }

  async function deleteNote({ id, name }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await Storage.remove(name);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  return (
    <View className="App">
      <Heading level={1}>Aviratha</Heading>
      <Divider
    orientation="horizontal" />
    
      <View as="form" padding="3rem" margin="3rem" onSubmit={createNote}>
      <Heading level={4}>Donation Details</Heading>
        <Flex direction={{ base: 'column' }} justifyContent="center">
          <TextField
            name="name"
            placeholder="Name"
            label="Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="date"
            placeholder="Date"
            label="Date"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="receiptNo"
            placeholder="Receipt No"
            label="Receipt No"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="pan"
            placeholder="PAN"
            label="PAN"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="referencePerson"
            placeholder="Reference Person"
            label="Reference Person"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="amount"
            placeholder="Amount"
            label="Amount"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="phone"
            placeholder="Phone"
            label="Phone"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="address"
            placeholder="Address"
            label="Address"
            labelHidden
            variation="quiet"
            required
          />
          <View
            name="image"
            as="input"
            type="file"
          />
          <Button type="submit" variation="primary">
            Submit
          </Button>
        </Flex>
      </View>
      <Heading level={4}>Donors Lists</Heading>
      <View padding="3rem" margin="3rem">

        <Flex
          direction={{ base: 'column', large: 'row' }}
          justifyContent="center"
          alignItems="center"
        >
          <Table overflow-x="auto">
            <TableHead>
              <TableRow>
                <TableCell as="th">Name</TableCell>
                <TableCell as="th">Description</TableCell>
                <TableCell as="th">Image</TableCell>
                <TableCell as="th"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notes.map((note) => (
                <TableRow key={note.id || note.name}>
                  <TableCell>{note.name}</TableCell>
                  <TableCell>
                    {note.amount}
                    {note.receiptNo}
                    {note.pan}
                    {note.amount}
                    {note.phone}
                    {note.referencePerson}
                  </TableCell>
                  <TableCell>{note.image && (
                    <Image
                      src={note.image}
                      alt={`visual aid for ${notes.name}`}
                      backgroundColor="initial"
                      height="40px"
                      opacity="100%"
                    />
                  )}</TableCell>
                  <TableCell>
                    <Button variation="link" onClick={() => deleteNote(note)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Flex>
      </View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};

export default withAuthenticator(App);