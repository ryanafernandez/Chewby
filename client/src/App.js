import React from "react";
import { 
  ApolloClient, 
  ApolloProvider, 
  InMemoryCache,
  createHttpLink, 
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './pages/Home';
import UserHome from './pages/UserHome';
import Navbar from "./components/Navbar";

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');

  return { 
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
console.log('****');
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
             <Route path="/" element={<Home />} /> 
            <Route 
              path="/userhome" 
              element={<UserHome />} 
            />
            <Route
              path="*"
              element={<h1 className="display-2">Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
