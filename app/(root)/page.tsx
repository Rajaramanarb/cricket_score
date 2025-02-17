import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <>
      <section className="w-full fles flex-col-reverse sm:flex-row justify-between gap-4">
        <h1 className="h1-bold text-dark100_light900">Dashboard</h1>
        <br />
        <h2 className="h3-bold text-dark200_light900">Coming Soon...</h2>
      </section>
    </>
  );
}
