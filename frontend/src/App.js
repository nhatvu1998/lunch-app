import React, { Suspense, lazy, useState, useContext, useEffect } from 'react'
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from '@digihcs/innos-ui3'
import jwt_decode from 'jwt-decode'
// import { AppContext, SWITCH_AUTH_STATUS } from "./reducer";
import Loading from './components/Loading/Loading'
import history from './history'
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthenticatedRoutes, UnauthenticatedRoutes } from "./configs/router";
import 'antd/dist/antd.css';
import './App.less'
import Site from './pages/siteManager';

const Components = {};
for (const c of AuthenticatedRoutes) {
  Components[c.component] = React.lazy(() => import(`./pages/` + c.component));
}

for (const c of UnauthenticatedRoutes) {
  Components[c.component] = React.lazy(() => import("./pages/" + c.component));
}


const token = window.localStorage.getItem("token");
function App() {
  // const { state, dispatch } = useContext(AppContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [site, setSite] = useState(window.localStorage.getItem('currentsite'))
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [token])

  const userId = (token) ? (jwt_decode(token).userId) : ''
  // useEffect(() => {
  //   if (token)
  //     dispatch({ type: SWITCH_AUTH_STATUS, payload: { status: true } });
  // }, []);
  return (
    // TODO: Các bạn implement code-splitting + React router (https://reactjs.org/docs/code-splitting.html).
    <Provider theme='pharmacy'>
      <Router history={history} >
        {/* Kiem tra de dieu huong khi nguoi dung truy cap vao index.html */}
        {isAuthenticated ? (
          <Redirect to="/home" />
        ) : (
            <Redirect to="/login" />
          )}
        <Switch>
          {UnauthenticatedRoutes.map(c => {
            // Route khong can bao ve, nhung khong duoc truy cap khi da authenticated
            const C = Components[c.component];
            return (
              <Route
                key={c.path}
                exact={c.isExact}
                path={c.path}
                render={(props) => (
                  <PublicRoute isAuthenticated={isAuthenticated}>
                    <Suspense fallback={<Loading />}>
                      <C {...props} setIsAuthenticated={setIsAuthenticated} />
                    </Suspense>
                  </PublicRoute>
                )}
              />
            );
          })}
          {AuthenticatedRoutes.map(c => {
            const C = Components[c.component];
            return (
              <Route
                key={c.path}
                exact
                path={c.path}
                render={(props) => (
                  // Bao ve Route can authentication bang Redirect
                  <PrivateRoute isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} {...props} setSite={setSite}>
                    <Suspense fallback={<Loading />}>
                      <C {...props} site={site} userId={userId} />
                    </Suspense>
                  </PrivateRoute>
                )}
              />
            );
          })}
          <Route path="/lun/sites" exact component={Site} />
        </Switch>
      </Router>
    </Provider>
  )
}

export default App