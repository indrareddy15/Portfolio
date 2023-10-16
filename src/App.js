import Intro from "./components/Intro/Intro";
import Navbar from "./components/NavBar/navbar";
import Skills from "./components/Skills/skills"



function App() {
  return (
    <div className="App">
      <Navbar />
      <Intro />
      <Skills />
    </div>
  );
}

export default App;
