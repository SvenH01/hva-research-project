import type { AppProps } from 'next/app'

import '../styles/globals.css';
import 'primereact/resources/themes/lara-dark-purple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import Navbar from "components/common/Navbar";

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Navbar/>

    <Component {...pageProps} />
    </>
}

export default MyApp
