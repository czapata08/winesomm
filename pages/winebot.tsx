// import type { NextPage } from "next";
// import Head from "next/head";
// import Image from "next/image";
// import { Toaster, toast } from "react-hot-toast";
// import DropDown, { VibeType } from "../components/DropDown";
import WineCard from "../components/wineCards";
import { useState } from "react";
import LoadingDots from "../components/LoadingDots";

import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

type WineInfo = {
  title: string;
  content: string;
};

export default function WineBot() {
  const [loading, setLoading] = useState(false);
  const [generatedBios, setGeneratedBios] = useState([]);
  const [wineData, setWineData] = useState<WineInfo[]>([]);

  // Define your wine data
  const wine = {
    name: "Château Lafite Rothschild",
    type: "Red Wine",
    region: "Bordeaux",
    varietal: "Cabernet Sauvignon",
    producer: "Domaines Barons de Rothschild",
  };

  // Construct your prompt
  const prompt = `
I'm keen on understanding the ${wine.name} by ${wine.producer}, a ${wine.type} from the ${wine.region} region, primarily crafted with ${wine.varietal} grapes, as if explained by a master sommelier. 

Please provide detailed yet clear sections for each of the following:

SECTION: Region\nGive a concise background of the ${wine.region} region, highlighting its history and climate that makes it unique.

SECTION: Terroir\nExplain the specific terroir characteristics of the ${wine.region} and how they contribute to the profile of a ${wine.varietal} wine like the ${wine.name}.

SECTION: Winemaking\nOutline the notable winemaking techniques that are typically used for a ${wine.varietal} wine like the ${wine.name}.

SECTION: Tasting Notes\nDescribe the key flavor and aroma characteristics one would expect when tasting a ${wine.varietal} wine from ${wine.region}, specifically the ${wine.name}.

SECTION: Food Pairing\nSuggest some ideal food pairings that would complement this wine, and also mention those that might clash.

SECTION: Similar Wines\nRecommend other wines with similar profiles that a fan of the ${wine.name} might also enjoy.

SECTION: Wine Summary\nProvide an overall summary of the ${wine.name}, encapsulating its uniqueness and charm in a user-friendly manner.
`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = response.body;
      if (!data) {
        return;
      }

      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = JSON.parse(event.data).text ?? "";
          const sections = data.split("SECTION: ").slice(1); // remove the first empty section
          const parsedData: WineInfo[] = sections.map((section: string) => {
            const [title, ...content] = section.split("\n");
            return { title, content: content.join("\n") };
          });
          setWineData((prev) => [...prev, ...parsedData]);
        }
      };

      console.log("wine data outside: ", wineData);

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
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!loading && (
        <button
          className='bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full'
          onClick={(e) => generateBio(e)}>
          Generate your spiel &rarr;
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
      <div className='flex flex-wrap justify-around'>
        {wineData.map((data, index) => (
          <WineCard
            key={index}
            title={data.title}
            content={data.content}
          />
        ))}
      </div>
    </>
  );
}
