import "bootstrap/dist/css/bootstrap.min.css"
import "./assets/css/style.scss"
import Header from "./Header";
import Split from "./pages/Split";
import Footer from "./Footer";
import Login from "./pages/Login";
import { BrowserRouter, Switch, Route, Link, withRouter } from "react-router-dom"
import { UserProvider } from "./Context"
import CreateSplit from "./pages/CreateSplit";
function App() {
  const FooterWithRouter = withRouter(Footer)
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Header />
          <main className="d-flex justify-content-center overflow-hidden">
            <Switch>
              <Route path="/users/:groupId" exact>User</Route>
              <Route path="/user/:userId">SingleUser</Route>
              <Route path="/split/:groupId"><Split/></Route>
              <Route path="/createSplit/:groupId"><CreateSplit/></Route>
              <Route path="/summary/:groupId"><Split/></Route>
              <Route path="/:groupId"><Split/></Route>
              <Route path="/"><Login/></Route>
            </Switch>
          </main>
          <FooterWithRouter/>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
