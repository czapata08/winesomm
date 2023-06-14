import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

const NavHeader = () => {
  const router = useRouter();
  const { locale, locales } = router;
  console.log("LOCALE: ", locale, "LOCALES: ", locales);
  const { data: session } = useSession();

  return (
    <div className='flex justify-between items-center p-3 bg-clear shadow-md'>
      <div className='cursor-pointer transition-colors duration-200 ease-in-out mr-2'>
        {!session ? (
          <div
            className='text-blue-900 font-normal text-base rounded-lg border p-1 border-blue-900'
            onClick={() => signIn()}>
            signIn
          </div>
        ) : (
          <div
            className='text-blue-900 font-normal text-base rounded-lg border p-1 border-blue-900'
            onClick={() => signOut()}>
            signOut
          </div>
        )}
      </div>
    </div>
  );
};

export default NavHeader;
