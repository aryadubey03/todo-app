//import logo from './logo.svg';
import { useParams } from 'react-router-dom';
import './index.css';
import TextBox from "./textbox";
function App() {
  const {name} = useParams();
  console.log("app rendered")
  return (
    <>
    <div class="todobox">
      <div id="headline">
        {name}
    </div>
    <div id="textbox">
       <TextBox listname={name}/>
    </div>
    </div>
    </>
  );
}

export default App;
