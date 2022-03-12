import Head from "next/head";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from "../components/shared/Navigation";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Poseidon Liquidity Pool</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main className="justify-center min-h-screen relative bg-body md:bg-transparent">
        <ToastContainer position="top-center" theme="dark" />
      </main>
    </div>
  );
}
