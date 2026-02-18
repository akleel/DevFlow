import { ContactForm } from '@/components/contact/ContactForm';

export default function Home() {
  return (
    <main className="p-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">DevFlow</h1>
        <p className="text-base">
          We build full websites, solve hard problems, and ship features fast.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Contact</h2>
        <ContactForm />
      </section>
    </main>
  );
} 