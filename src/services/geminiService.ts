import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface VibeResult {
  title: string;
  secretSkill: string;
  energyLevel: number;
  luckLevel: number;
  lazinessLevel: number;
  funnyVerdict: string;
  colorTheme: string; // hex code
  imageUrl?: string;
  category?: string;
  categoryDescription?: string;
}

const CATEGORY_NAMES: Record<string, string> = {
  lazy: "အပျင်းထူသူ",
  foodie: "အစားအသောက် မက်သူ",
  gamer: "ဂိမ်းအရူးလေး",
  drama: "ဒရာမာ မင်းသား/မင်းသမီး",
  genius: "ဉာဏ်ကြီးရှင်",
  clumsy: "လက်စလက်န မရှိသူ",
  party: "ပါတီစတား",
  rich: "သူဌေးကြီး",
  overthinker: "အတွေးများသူ",
  sleepy: "အိပ်ပုပ်ကြီး",
  savage: "လူကြမ်းကြီး",
  broke: "ဘတ်ပြတ်နေသူ",
  flexer: "ကြွားချင်သူ",
  emotional: "ခံစားလွယ်သူ",
  gym_rat: "Gym အရူးလေး",
};

const CATEGORY_IMAGES: Record<string, string[]> = {
  lazy: [
    "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519066629447-267ffbb62d4b?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?q=80&w=1000&auto=format&fit=crop",
  ],
  foodie: [
    "https://images.unsplash.com/photo-1534127391482-3c140c7b603a?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1563464948-11b62030a5ce?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582231406818-40787f1c95b0?q=80&w=1000&auto=format&fit=crop",
  ],
  gamer: [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=1000&auto=format&fit=crop",
  ],
  drama: [
    "https://images.unsplash.com/photo-1454486837617-ce8e1ba5ebfe?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503431128871-cd250803fb41?q=80&w=1000&auto=format&fit=crop",
  ],
  genius: [
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527430295725-4995058ec102?q=80&w=1000&auto=format&fit=crop",
  ],
  clumsy: [
    "https://images.unsplash.com/photo-1541364983171-a8ba01d95cfc?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510337550647-e84f83e341ca?q=80&w=1000&auto=format&fit=crop",
  ],
  party: [
    "https://images.unsplash.com/photo-1514525253361-b83f859b73c0?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop",
  ],
  rich: [
    "https://images.unsplash.com/photo-1526304640581-d334cdbbfddc?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1553729459-014266a7f508?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589758675928-0feecf7640ed?q=80&w=1000&auto=format&fit=crop",
  ],
  overthinker: [
    "https://images.unsplash.com/photo-1494173853739-c21f58b16055?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop",
  ],
  sleepy: [
    "https://images.unsplash.com/photo-1584947848229-431f94c3d9a1?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?q=80&w=1000&auto=format&fit=crop",
  ],
  savage: [
    "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517423440428-a5a00ad1e3e8?q=80&w=1000&auto=format&fit=crop",
  ],
  broke: [
    "https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?q=80&w=1000&auto=format&fit=crop",
  ],
  flexer: [
    "https://images.unsplash.com/photo-1502945015378-0e28404a5ad0?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584305323473-d67485a82101?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop",
  ],
  emotional: [
    "https://images.unsplash.com/photo-1492101851996-5fc7067f938b?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542044801-30d3e45ae49a?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515023115689-589c33041d3c?q=80&w=1000&auto=format&fit=crop",
  ],
  gym_rat: [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1540206276207-3af25c08abb4?q=80&w=1000&auto=format&fit=crop",
  ],
};

function getCategoryUrl(category: string, name: string): string {
  const normalized = (category || "").toLowerCase().trim();
  const images = CATEGORY_IMAGES[normalized] || CATEGORY_IMAGES.clumsy;
  // Simple hash of the name to pick consistently for the same name but different for others
  const hash = (name || "friend").split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return images[hash % images.length];
}

const SPECIAL_NAMES: Record<string, Partial<VibeResult>> = {
  "lae yi htwe": {
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1000&auto=format&fit=crop",
  },
  "လဲ့ရည်ထွေး": {
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1000&auto=format&fit=crop",
  },
  "zaw naing": {
    imageUrl: "https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?q=80&w=1000&auto=format&fit=crop",
  },
  "ဇော်နိုင်": {
    imageUrl: "https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?q=80&w=1000&auto=format&fit=crop",
  },
  "may myat noe": {
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop",
  },
  "မေမြတ်နိုး": {
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop",
  },
  "sabal moe": {
    imageUrl: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=1000&auto=format&fit=crop",
  },
  "စံပယ်မိုး": {
    imageUrl: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=1000&auto=format&fit=crop",
  },
};

export async function analyzeVibe(name: string): Promise<VibeResult> {
  const normalizedName = name.toLowerCase().trim();
  const specialMatch = SPECIAL_NAMES[normalizedName];

  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze the "vibe" of a person named "${name}" for a prank website. 
  The goal is to be funny, lighthearted, and slightly teasing (in a friendly way). 
  Results should be in Burmese language for the text fields.

  CRITICAL: 
  1. Every single time you are called, you MUST generate a DIFFERENT, NEW, and EXTREMELY UNIQUE response. Do NOT repeat previous jokes, titles, or descriptions. Use your imagination to create fresh humor every time.
  2. SPECIAL CASE: If the name is "Khaing Min Thant" (or "ခိုင်မင်းသန့်"), you MUST be EXTREMELY positive, heroically complimentary, and inspiring. Highlight their great personality, kindness, success, and intelligence. NO teasing for this person. Give them maximum Luck and Energy, and minimal Laziness.
  3. For other special personas like "lae yi htwe" (Sleepy), "zaw naing" (Professional Excuse Maker/Expert at avoiding work), "may myat noe" (Mirror Selfie), "sabal moe" (Drama), you can keep their themes but make the actual jokes and titles vary wildly.
  
  Generate a creative "Vibe Title".
  A "Secret Skill" that is ridiculous or impressive.
  Three levels from 0 to 100: Energy, Luck, and Laziness.
  A short, funny "AI Verdict" sentence in Burmese.
  Choose a vibrant hex color for their "Aura".
  Also categorize them into one of these: lazy, foodie, gamer, drama, genius, clumsy, party, rich, overthinker, sleepy, savage, broke, flexer, emotional, gym_rat.
  
  RNG Seed for variety: ${Math.random()}`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          secretSkill: { type: Type.STRING },
          energyLevel: { type: Type.NUMBER },
          luckLevel: { type: Type.NUMBER },
          lazinessLevel: { type: Type.NUMBER },
          funnyVerdict: { type: Type.STRING },
          colorTheme: { type: Type.STRING },
          category: { type: Type.STRING },
        },
        required: ["title", "secretSkill", "energyLevel", "luckLevel", "lazinessLevel", "funnyVerdict", "colorTheme", "category"],
      },
    },
  });

  try {
    const result = JSON.parse(response.text.trim()) as VibeResult;
    const finalCategory = result.category || "clumsy";
    const finalImage = specialMatch?.imageUrl || getCategoryUrl(finalCategory, name);
    const categoryDescription = CATEGORY_NAMES[finalCategory.toLowerCase()] || "စုံစမ်းဆဲ";
    
    if (specialMatch) {
      return { 
        ...result, 
        ...specialMatch, 
        imageUrl: finalImage,
        categoryDescription: specialMatch.categoryDescription || categoryDescription 
      };
    }
    
    return { ...result, imageUrl: finalImage, categoryDescription };
  } catch (e) {
    console.error("Failed to parse AI response", e);
    const fallback: VibeResult = {
      title: "Legitimate Overthinker",
      secretSkill: "Sleeping while sitting",
      energyLevel: 12,
      luckLevel: 88,
      lazinessLevel: 99,
      funnyVerdict: "ဒီလူကတော့ အပျင်းဆုံးစာရင်းထဲမှာ ထိပ်ဆုံးကပဲ!",
      colorTheme: "#ff4e00",
      imageUrl: getCategoryUrl("lazy", name),
      categoryDescription: CATEGORY_NAMES.lazy
    };

    if (specialMatch) {
      return { 
        ...fallback, 
        ...specialMatch, 
        imageUrl: specialMatch.imageUrl || fallback.imageUrl,
        categoryDescription: specialMatch.categoryDescription || fallback.categoryDescription
      };
    }
    return fallback;
  }
}
