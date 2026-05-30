import LeadForm from "@/components/LeadForm";

export default function LandingPage() {
  return (
    <>
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 px-6 py-20 text-white sm:py-28 lg:py-36">
          <div className="pointer-events-none absolute -right-40 -top-40 size-96 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 size-80 rounded-full bg-emerald-300/10 blur-3xl" />
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-brand-200 backdrop-blur">
              Zero CMS &bull; Zero Third-Party Forms &bull; Zero Hassle
            </div>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Turn Visitors Into{" "}
              <span className="text-brand-300">Clients</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-brand-100 sm:text-xl">
              A professional landing page backed by a smart lead-capture system.
              No CMS, no third-party forms, no monthly fees.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#contact"
                className="inline-block rounded-xl bg-white px-8 py-4 text-sm font-semibold text-brand-800 shadow-lg transition hover:bg-brand-50 focus:ring-2 focus:ring-white/50 focus:outline-none"
              >
                Get Started Free
              </a>
              <a
                href="#features"
                className="inline-block rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10 focus:ring-2 focus:ring-white/50 focus:outline-none"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        <section id="features" className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-4 text-center">
              <span className="inline-block rounded-full bg-brand-50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
                Features
              </span>
            </div>
            <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything You Need to Capture Leads
            </h2>
            <p className="mb-14 text-center text-gray-500">
              Purpose-built for small businesses that want results, not complexity.
            </p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-100 hover:shadow-lg"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-brand-50 text-lg font-bold text-brand-600 transition group-hover:bg-brand-100 group-hover:scale-110">
                    {f.title[0]}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-gray-50 px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 text-center">
              <span className="inline-block rounded-full bg-brand-50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
                Contact
              </span>
            </div>
            <h2 className="mb-2 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
              Get in Touch
            </h2>
            <p className="mb-10 text-center text-gray-500">
              Fill out the form below and we&apos;ll respond within 24 hours.
            </p>
            <div className="rounded-2xl bg-white p-8 shadow-sm sm:p-12">
              <LeadForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 bg-white px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="flex size-7 items-center justify-center rounded-md bg-brand-600 text-xs font-bold text-white">
              LP
            </div>
            LeadGen Pro
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="/admin" className="transition hover:text-gray-600">
              Admin
            </a>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
        </div>
      </footer>
    </>
  );
}

const features = [
  {
    title: "Blazing Fast",
    desc: "Loads in under a second on mobile. No bloated CMS — just pure, optimized performance that converts.",
  },
  {
    title: "Your Data, Your Control",
    desc: "All leads stored locally in SQLite. No third-party form processors. Export anytime as CSV or JSON.",
  },
  {
    title: "Mobile-First Design",
    desc: "Looks stunning on every device. Convert visitors whether they're on phone, tablet, or desktop.",
  },
  {
    title: "Smart Validation",
    desc: "Client- and server-side validation catches errors early. Clean data, every time.",
  },
  {
    title: "Instant Export",
    desc: "Download all leads as CSV or JSON with one click. No dashboards to learn — just data you can use.",
  },
  {
    title: "Zero Dependencies",
    desc: "No external form services, no API keys, no monthly fees. What you see is what you get.",
  },
];
