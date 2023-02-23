import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/homepage";
import Login from "./pages/login";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
