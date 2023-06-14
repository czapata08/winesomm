import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { FormEvent } from "react";

const pageTitle = "Login";
const logo = "/winebot.png";
const description = "Winebot Login Page";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const { query } = useRouter();
  const { error } = query;

  //Error handling and notification w Toast
  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const email = e.currentTarget.email.value;
    signIn("email", { email });
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <Head>
        <title>{pageTitle}</title>

        <link
          rel='icon'
          href={logo}
        />
        <link
          rel='shortcut icon'
          type='image/x-icon'
          href={logo}
        />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href={logo}
        />
      </Head>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <Image
          alt='Winebot AI Somm'
          width={100}
          height={100}
          className='relative mx-auto h-12 w-auto'
          src='/winebot.png'
        />
      </div>

      <div className='mt-8 mx-auto sm:w-full w-11/12 sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10'>
          <form onSubmit={handleSubmit}>
            <input
              type='email'
              id='email'
              required
              name='email'
              className='block w-full px-5 py-2 border rounded-lg bg-white shadow-lg placeholder-gray-400 text-gray-700 focus:ring focus:outline-none'
              placeholder='Email'
            />
            <button
              type='submit'
              className='group flex justify-center items-center space-x-5 w-full sm:px-4 h-16 my-2 rounded-md focus:outline-none bg-black text-white'>
              Email Link Sign-in
            </button>
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
