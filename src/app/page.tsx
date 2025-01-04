import { ArrowLeftCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="flex space-x-2 items-center animate-pulse">
      <ArrowLeftCircle size={48} />
      <h1 className="font-bold">Get started with creating a New Document</h1>
    </main>
  );
}
