import React, { useState } from 'react';
import './App.css';
import CreateCharacter from "./components/CreateCharacter"
import CharacterCards from "./components/CharacterCards"

interface Character {
  name: string;
  strength: number;
  dexterity: number;
  constitution: number;
  charisma: number;
  intelligence: number;
  wisdom: number;
}

const Init_Characters: Character[] = []

function App() {

  const [characters, setCharacters] = useState(Init_Characters)

  return (
    <div className="App">
      <h1>RPG Character Sheet Creator</h1>
      
      {characters.length > 0 ?<CharacterCards characters={characters} /> : <h3>Characters you create will show up here</h3>}
      <CreateCharacter />

    </div>
  );
}

export default App;
