import reactLogo from "./assets/react.svg";
import "./App.css";
import API from "./classes/api";

function App() {
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
                            "2f4e04fe-808c-473a-9b3a-6711f61e043b",
                            "5e20e2a3-25d7-42b4-9862-3024abadf3a3",
                        );
                        console.log(resp);
                    }}
                >
                    Connect Exercise
                </button>
            </div>
        </main>
    );
}

export default App;
