import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const [producer, setProducer] = useState("");
  const [varietal, setVarietal] = useState("");
  const router = useRouter();
  // const [vibe, setVibe] = useState<VibeType>("Professional");
  const [generatedBios, setGeneratedBios] = useState<String>("");

  const bioRef = useRef<null | HTMLDivElement>(null);
  const { data: session, status } = useSession();

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  // Define your wine data
  // const wine = {
  //   name: "Château Lafite Rothschild",
  //   type: "Red Wine",
  //   region: "Bordeaux",
  //   varietal: "Cabernet Sauvignon",
  //   producer: "Domaines Barons de Rothschild",
  // };

  // Construct your prompt
  //   const prompt = `
  // Please present a master sommelier's assessment of the ${wine.name} by ${wine.producer}, a ${wine.type} from the ${wine.region} made mainly from ${wine.varietal} grapes:

  // SECTION: Region\nBriefly describe the ${wine.region} region's history and unique climate.

  // SECTION: Terroir\nHow do the terroir characteristics of the ${wine.region} influence a ${wine.varietal} wine like the ${wine.name}?

  // SECTION: Winemaking\nWhat winemaking techniques are often employed for a ${wine.varietal} wine like the ${wine.name}?

  // SECTION: Tasting Notes\nWhat are the key flavors and aromas of a ${wine.varietal} wine from ${wine.region}, particularly the ${wine.name}?

  // SECTION: Food Pairing\nWhat foods pair well with this wine, and which ones should be avoided?

  // SECTION: Similar Wines\nCan you suggest other wines that share a similar profile to the ${wine.name}?

  // SECTION: Wine Summary\nBriefly summarize the ${wine.name}, highlighting its unique aspects.
  // `;
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    router.push("/");
    return <p>Access Denied</p>;
  }

  const getPrompt = () => {
    return `
    Guide us on a sensory journey through the ${name} by ${producer}, a notable ${type} hailing from the distinguished ${region}, crafted primarily from ${varietal} grapes:

    SECTION: Region\nTell us the story of the ${region}, painting a picture of its rich history and the climatic nuances that make it truly unique.

    SECTION: Terroir\nHow does the distinctive terroir of the ${region} breathe life into a ${varietal} wine such as the ${name}?

    SECTION: Winemaking\nLet us peek behind the scenes. What artful winemaking techniques breathe life into a ${varietal} wine like the ${name}?

    SECTION: Tasting Notes\nInvite us to an imaginary tasting of the ${name}. What symphony of flavors and aromas awaits us in a glass of this ${varietal} wine from ${region}?

    SECTION: Food Pairing\nAs we consider a meal, what culinary creations would dance beautifully with this wine, and which ones might step on its toes?

    SECTION: Similar Wines\nFor those enchanted by the ${name}, which other wines might they also find intriguing, offering a similar whisper of allure?

    SECTION: Wine Summary\nFinally, if the ${name} were a sonnet, how might it read? Summarize its charm and unique narrative in a brief yet captivating manner.
    `;
  };

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: getPrompt(),
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const onParse = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event") {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? "";
          setGeneratedBios((prev) => prev + text);
        } catch (e) {
          console.error(e);
        }
      }
    };

    // https://web.dev/streams/#the-getreader-and-read-methods
    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParse);
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }
    scrollToBios();
    setLoading(false);
  };

  return (
    <div className='flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
      <Head>
        <title>AI SOMM</title>
        <link
          rel='icon'
          href='/favicon.ico'
        />
      </Head>

      <Header />
      <main className='flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mt-20'>
        {/* <h1 className='sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900'>
          Winebot
        </h1> */}
        <div className='max-w-xl w-full'>
          <h2 className='text-left font-medium'>Wine Name </h2>
          <textarea
            value={name}
            onChange={(e) => setName(e.target.value)}
            rows={1}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-1'
            placeholder={"Wine Name"}
          />
          <h2 className='text-left font-medium'>Varietal</h2>
          <textarea
            value={varietal}
            onChange={(e) => setVarietal(e.target.value)}
            rows={2}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-1'
            placeholder={
              "e.g. Cabernet Franc, Reisling, Granache.... if multiple please least them"
            }
          />
          <h2 className='text-left font-medium'>Region</h2>
          <textarea
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            rows={1}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-1'
            placeholder={"e.g. Alsace, Burgundy, Rhone"}
          />
          <h2 className='text-left font-medium'>Producer</h2>
          <textarea
            value={producer}
            onChange={(e) => setProducer(e.target.value)}
            rows={1}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-1'
            placeholder={"e.g. Latife, Egly, Krug"}
          />
          <h2 className='text-left font-medium'>Type</h2>
          <textarea
            value={type}
            onChange={(e) => setType(e.target.value)}
            rows={1}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-1'
            placeholder={"e.g. Red, white, champagne"}
          />
          <h2 className='text-left font-medium'></h2>
          {/* <div className='flex mb-5 items-center space-x-3'>
            <Image
              src='/2-black.png'
              width={30}
              height={30}
              alt='1 icon'
            />
            <p className='text-left font-medium'>Select your vibe.</p>
          </div>
          <div className='block'>
            <DropDown
              vibe={vibe}
              setVibe={(newVibe) => setVibe(newVibe)}
            />
          </div> */}
          {!loading && (
            <button
              className='bg-black rounded-xl text-white font-medium px-4 py-2 mt-2 hover:bg-black/80 w-full'
              onClick={(e) => generateBio(e)}>
              Become A SOMM &rarr;
            </button>
          )}
          {loading && (
            <button
              className='bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full'
              disabled>
              <LoadingDots
                color='white'
                style='large'
              />
            </button>
          )}
        </div>
        <Toaster
          position='top-center'
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className='h-px bg-gray-700 border-1 dark:bg-gray-700' />
        <div className='space-y-10 my-10'>
          {generatedBios && (
            <>
              <div>
                <h2
                  className='sm:text-4xl text-3xl font-bold text-slate-900 mx-auto'
                  ref={bioRef}>
                  Your Wine Information
                </h2>
              </div>
              <div className='space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto'>
                {generatedBios
                  .split("SECTION: ")
                  .slice(1)
                  .map((generatedBio) => {
                    return (
                      <div
                        className='bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border'
                        onClick={() => {
                          navigator.clipboard.writeText(generatedBio);
                          toast("Bio copied to clipboard", {
                            icon: "✂️",
                          });
                        }}
                        key={generatedBio}>
                        <h3 className='text-blue-500 text-2xl pb-2'>
                          {generatedBio.split("\n")[0].split(" ")}
                        </h3>
                        <p>{generatedBio}</p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
