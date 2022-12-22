import React, { useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, Storage } from 'aws-amplify';
import {
  Button,
  Flex,
  Heading,
  TextField,
  View,
  Divider,
  withAuthenticator,
} from '@aws-amplify/ui-react';
import {
  createNote as createNoteMutation,
} from "./graphql/mutations";
import { redirect } from "react-router-dom";

const App = ({ signOut }) => {

  useEffect(() => {
  }, []);


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
    event.target.reset();
    return redirect("/donors");
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

      <View as="form"  onSubmit={createNote}>

        <Flex direction={{ base: 'column' }} justifyContent="center">
          <Heading level={4}>Donation Details</Heading>
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
            placeholder="PAN/Transaction Ref/ Bank Details"
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
    </View>
  );
};

export default withAuthenticator(App);