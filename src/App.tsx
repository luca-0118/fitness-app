import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import API from "./classes/api";

function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");

    async function greet() {
        const workouts = await API.workouts.list();
        console.log(workouts);
    }

    return (
        <main className="container">
            <h1>Welcome to Tauri + React</h1>

            <div className="row">
                <a href="https://vite.dev" target="_blank">
                    <img src="/vite.svg" className="logo vite" alt="Vite logo" />
                </a>
                <a href="https://tauri.app" target="_blank">
                    <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <p>Click on the Tauri, Vite, and React logos to learn more.</p>

            <div className="flex gap-16">
                <button
                    onClick={async (e) => {
                        e.preventDefault();
                        const workouts = await API.workouts.list();
                        console.log(workouts);
                    }}
                >
                    Query list
                </button>
                <button
                    onClick={async (e) => {
                        e.preventDefault();
                        const resp = await API.workouts.create("TestWorkout", "This is a testworkout");
                        console.log(resp);
                    }}
                >
                    Create Workout
                </button>
                <button
                    onClick={async (e) => {
                        e.preventDefault();
                        const resp = await API.exercises.create("testExercise", "random Desc");
                        console.log(resp);
                    }}
                >
                    Create Exercise
                </button>
                <button
                    onClick={async (e) => {
                        e.preventDefault();
                        const resp = await API.workouts.linkExercise(
                            "74383b41-e4ac-400b-8850-f92bcdc64116",
                            "852633de-fc81-44b2-8369-da8465059c6c",
                        );
                        console.log(resp);
                    }}
                >
                    Connect Exercise
                </button>
            </div>
            <p>{greetMsg}</p>
        </main>
    );
}

export default App;
