export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="font-semibold tracking-tight">AI Agent Demo</div>
          <nav className="hidden gap-6 text-sm text-zinc-300 md:flex">
            <a className="hover:text-white" href="#beneficios">Beneficios</a>
            <a className="hover:text-white" href="#como">Cómo funciona</a>
            <a className="hover:text-white" href="#contacto">Contacto</a>
          </nav>
          <a
            href="#contacto"
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
          >
            Agendar demo
          </a>
        </div>
      </header>

      {/* HERO */}
      <main className="mx-auto max-w-6xl px-6">
        <section className="py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                Landing de práctica para conectar IA + n8n
              </p>

              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Automatiza atención y ventas con un agente de IA
                <span className="text-zinc-400"> sin complicarte.</span>
              </h1>

              <p className="mt-4 text-zinc-300">
                Esta landing está pensada para que pruebes tu agente embebido en web
                y lo conectes a n8n (Webhook). Sencilla, rápida y lista para Vercel.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contacto"
                  className="rounded-xl bg-white px-5 py-3 text-center text-sm font-medium text-zinc-900 hover:bg-zinc-200"
                >
                  Quiero probar el agente
                </a>
                <a
                  href="#como"
                  className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-medium text-white hover:bg-white/10"
                >
                  Ver cómo funciona
                </a>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 text-sm text-zinc-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-white font-semibold">24/7</div>
                  <div className="mt-1 text-xs">Respuestas</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-white font-semibold">+Leads</div>
                  <div className="mt-1 text-xs">Captura</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-white font-semibold">n8n</div>
                  <div className="mt-1 text-xs">Automatiza</div>
                </div>
              </div>
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
                <div className="text-sm text-zinc-300">Demo UI (placeholder)</div>
                <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-zinc-200">
                    👋 Hola, soy tu asistente. ¿Qué producto o servicio buscas hoy?
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-500"
                    placeholder="Escribe aquí…"
                    disabled
                  />
                  <button
                    className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-zinc-900"
                    disabled
                  >
                    Enviar
                  </button>
                </div>
                <p className="mt-3 text-xs text-zinc-500">
                  Usa la burbuja de chat en la esquina inferior para hablar conmigo por texto o voz.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFICIOS */}
        <section id="beneficios" className="py-14">
          <h2 className="text-2xl font-semibold tracking-tight">Beneficios</h2>
          <p className="mt-2 text-zinc-300">
            Una base limpia para probar agente + automatizaciones sin fricción.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { title: "Súper rápida", desc: "Next.js + Tailwind + Vercel, listo en minutos." },
              { title: "Escalable", desc: "Le agregas chat, voz, formularios y tracking." },
              { title: "Conectable a n8n", desc: "Ideal para Webhook + flujos de automatización." },
            ].map((b) => (
              <div
                key={b.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="text-white font-semibold">{b.title}</div>
                <div className="mt-2 text-sm text-zinc-300">{b.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como" className="py-14">
          <h2 className="text-2xl font-semibold tracking-tight">Cómo funciona</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { step: "1", title: "Usuario escribe", desc: "Chat web (texto o audio)." },
              { step: "2", title: "Webhook a n8n", desc: "Tu flujo procesa y llama al agente." },
              { step: "3", title: "Respuesta + acción", desc: "Guía compra/pago y dispara automatizaciones." },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="text-xs text-zinc-400">Paso {s.step}</div>
                <div className="mt-1 text-white font-semibold">{s.title}</div>
                <div className="mt-2 text-sm text-zinc-300">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="py-14">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Listo para conectar tu agente?
            </h2>
            <p className="mt-2 text-zinc-300">
              Deja un email y luego lo conectas a tu Webhook de n8n.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-500"
                placeholder="tu@email.com"
              />
              <button className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-200">
                Enviar
              </button>
            </div>

            <p className="mt-3 text-xs text-zinc-500">
              (Este botón aún no envía nada. Luego lo conectamos a n8n.)
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-6xl px-6 text-sm text-zinc-400">
          © {new Date().getFullYear()} AI Agent Demo — Landing de práctica.
        </div>
      </footer>
    </div>
  );
}
