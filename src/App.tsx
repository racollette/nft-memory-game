import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Gameboard } from "./components/Gameboard";
import { fetchTiles } from "./hooks/fetchTiles";

const IMPOSTORS_CONTRACT = "0x3110ef5f612208724ca51f5761a69081809f03b7";
const IMAGE_BUCKET = `https://storage.googleapis.com/nftimagebucket/tokens/${IMPOSTORS_CONTRACT}/preview`;
const GUESSES = 10;

function App() {
  const tiles = fetchTiles();

  // useEffect(() => {
  // }, []);

  return (
    <div className="App">
      <h1 className="font-link text-6xl font-bold mb-8">Sus Memory</h1>
      <Gameboard tiles={tiles} imageBucket={IMAGE_BUCKET} guesses={GUESSES} />
    </div>
  );
}

export default App;
