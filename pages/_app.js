import { createGlobalStyle } from "styled-components";
import { CartContextProvider } from "../components/CartContext";
import { AuthProvider } from '../../ecommerce-front/components/Form/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SearchContextProvider } from "../components/SearchContext";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  body {
    background-color: #eee;
    padding: 0;
    margin: 0;
    font-family: 'Poppins', sans-serif;
  }
`;

function MyApp({ Component, pageProps }) {
  return (
    <SearchContextProvider>
      <AuthProvider>
        <GlobalStyles />
        <CartContextProvider>
          <ToastContainer position="bottom-right" />
          <Component {...pageProps} />
        </CartContextProvider>
      </AuthProvider>
    </SearchContextProvider>
  );
}

export default MyApp;
