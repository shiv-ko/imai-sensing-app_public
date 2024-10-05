'use client'
import React, { useState, useEffect } from "react";

import "@aws-amplify/ui-react/styles.css";
import {
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  View,
  withAuthenticator
} from "@aws-amplify/ui-react";
import { listNotes } from "../../graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "../../graphql/mutations";
import { generateClient } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import awsExports from './../../aws-exports';
Amplify.configure(awsExports);
// GraphQL クエリとミューテーション用のクライアント生成
const client = generateClient();

// Noteの型定義
interface Note {
  id: string;
  name: string;
  description: string;
}

interface AppProps {
  signOut: () => void;
}

const Test: React.FC<AppProps> = ({ signOut }) => {
  const [notes, setNotes] = useState<Note[]>([]);  // Note配列の状態管理

  // useEffectを使って最初にデータを取得
  useEffect(() => {
    fetchNotes();
  }, []);

  // ノートを取得する関数
  async function fetchNotes() {
    try {
      const apiData = await client.graphql({ query: listNotes });
      const notesFromAPI = apiData.data.listNotes.items as Note[];
      setNotes(notesFromAPI);
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
  }

  // ノートを作成する関数
  async function createNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.target as HTMLFormElement);
    const data = {
      name: form.get("name") as string,
      description: form.get("description") as string,
    };
    console.log('sending data',data)
    try {
      await client.graphql({
        query: createNoteMutation,
        variables: { input: data },
      });
      console.log(data)
      fetchNotes();
        (event.target as HTMLFormElement).reset();  // フォームをリセット
    } catch (error) {
      console.error("Error creating note: ", error);
    }
  }


  // ノートを削除する関数
  async function deleteNote(note: Note) {
    const newNotes = notes.filter((n) => n.id !== note.id);
    setNotes(newNotes);
    try {
      await client.graphql({
        query: deleteNoteMutation,
        variables: { input: { id: note.id } },
      });
    } catch (error) {
      console.error("Error deleting note: ", error);
    }
  }

  return (
    <View className="App">
      <Heading level={1}>My Notes App</Heading>
      <View as="form" margin="3rem 0" onSubmit={createNote}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Note Description"
            label="Note Description"
            labelHidden
            variation="quiet"
            required
          />
          <Button type="submit" variation="primary">
            Create Note
          </Button>
        </Flex>
      </View>
      <Heading level={2}>Current Notes</Heading>
      <View margin="3rem 0">
        {notes.map((note) => (
          <Flex
            key={note.id || note.name}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text as="strong" fontWeight={700}>
              {note.name}
            </Text>
            <Text as="span">{note.description}</Text>
            <Button variation="link" onClick={() => deleteNote(note)}>
              Delete note
            </Button>
          </Flex>
        ))}
      </View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};


export default withAuthenticator(Test);
