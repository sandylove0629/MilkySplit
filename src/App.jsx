import "bootstrap/dist/css/bootstrap.min.css"
import "./assets/css/style.scss"
import Header from "./Header";
import Split from "./pages/Split";
import Footer from "./Footer";
// import Login from "./pages/Login";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom"
// import { authContext } from ""
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <main className="d-flex justify-content-center overflow-hidden">
          <Switch>
            <Route path="/users/:group_id" exact>User</Route>
            <Route path="/user/:userId">SingleUser</Route>
            <Route path="/split/:group_id"><Split/></Route>
            <Route path="/summary/:group_id"><Split/></Route>
            <Route path="/:group_id"><Split/></Route>
            {/* <Route path="/"><Login/></Route> */}
          </Switch>
        </main>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
