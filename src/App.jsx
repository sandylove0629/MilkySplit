import "bootstrap/dist/css/bootstrap.min.css"
import "./assets/css/style.scss"
import Header from "./Header";
import Split from "./pages/Split";
import SplitUser from "./pages/SplitUser"
import Users from "./pages/Users"
import CreateUser from "./pages/CreateUser"
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
              <Route name="users" path="/users/:groupId" exact><Users/></Route>
              <Route name="createUser" path="/createUser/:groupId"><CreateUser/></Route>
              <Route name="splitUser" path="/splitUser/:groupId/:userId/" exact><SplitUser/></Route>
              <Route name="split" path="/split/:groupId"><Split/></Route>
              <Route name="createSplit" path="/createSplit/:groupId"><CreateSplit/></Route>
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
