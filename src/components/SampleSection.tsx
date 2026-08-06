import React from "react";

export default function SampleSection() {
  return (
    <section className="relative w-full min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 py-20 border-t border-white/10 select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center z-10 flex flex-col items-center gap-8">
        <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm border border-amber-400/30 px-4 py-1.5 rounded-full bg-amber-400/5">
          Experiencia Uppercat
        </span>

        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
          Guía Esencial de Cuidados para <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500">
            Gatitos Bebés 🐾
          </span>
        </h2>

        <p className="text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed font-light">
          Porque incluso el felino más rudo de la agencia necesita su tetero tibio a tiempo, masajitos estimulantes en la panza y al menos 18 horas de siesta para que la creatividad vuelva a brillar.
        </p>

        {/* Kitten Care Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left hover:border-amber-400/50 transition-all">
            <div className="text-amber-400 font-bold text-xl mb-2">🍼 01. El Tetero & Dieta</div>
            <p className="text-sm text-white/60">
              Fórmula maternizada especial para gatitos cada 3 horas. Nada de leche entera de vaca o nuestro director creativo tendrá pataleta estomacal antes de la entrega.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left hover:border-amber-400/50 transition-all">
            <div className="text-amber-400 font-bold text-xl mb-2">😴 02. Horas de Siesta</div>
            <p className="text-sm text-white/60">
              Mantas térmicas y 20 horas de sueño regenerativo diario. Si lo despiertas antes de su siesta, se negará rotundamente a exportar el video final.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left hover:border-amber-400/50 transition-all">
            <div className="text-amber-400 font-bold text-xl mb-2">🎾 03. Juego & Rascador</div>
            <p className="text-sm text-white/60">
              Rascadores ergonómicos y pelotitas de lana con cascabel para canalizar el estrés y afilar las garras creativas ante revisiones del cliente.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
