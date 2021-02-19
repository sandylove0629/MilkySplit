import "bootstrap/dist/css/bootstrap.min.css"
import "./assets/css/style.scss"
import Header from "./Header";
import Split from "./pages/Split";
import SplitUser from "./pages/SplitUser"
import UpdateGroup from "./pages/UpdateGroup"
import Users from "./pages/Users"
import CreateUsers from "./pages/CreateUsers"
import UpdateUsers from "./pages/UpdateUsers"
import UpdateSplit from "./pages/UpdateSplit"
import Footer from "./Footer";
import Login from "./pages/Login";
import Summary from "./pages/Summary";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom"
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
              <Route name="editGroup" path="/editGroup/:groupId"><UpdateGroup/></Route>
              <Route name="users" path="/users/:groupId" exact><Users/></Route>
              <Route name="createUsers" path="/createUsers/:groupId"><CreateUsers/></Route>
              <Route name="updateUsers" path="/editUsers/:groupId/:userId"><UpdateUsers/></Route>
              <Route name="splitUser" path="/splitUser/:groupId/:userId" exact><SplitUser/></Route>
              <Route name="split" path="/split/:groupId"><Split/></Route>
              <Route name="createSplit" path="/createSplit/:groupId"><CreateSplit/></Route>
              <Route name="updateSplit" path="/editSplit/:groupId/:splitId"><UpdateSplit/></Route>
              <Route name="summary" path="/summary/:groupId"><Summary/></Route>
              <Route name="home" path="/"><Login/></Route>
            </Switch>
          </main>
          <FooterWithRouter/>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
