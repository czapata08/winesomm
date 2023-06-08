import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className='flex items-center justify-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2'>
      <Link href='/'>
        <Image
          alt='header text'
          src='/winebot.png'
          width={160}
          height={12}
        />
        {/* <h1 className='sm:text-4xl text-2xl font-bold ml-2 tracking-tight'>
          twitterBio.com
        </h1> */}
      </Link>
      {/* <div className='mx-4'>
        <Image
          alt='Vercel Icon'
          src='/winebot-icon.png'
          className='sm:w-8 sm:h-[27px] w-8 h-[28px]'
          width={58}
          height={55}
        />
      </div> */}
    </header>
  );
}
