import "./App.css";
import { useEffect, useRef, useState } from "react";
import { ClipboardList, User, Bus, MapPin, Check, Sparkles } from "lucide-react";
import { SiReact, SiVite, SiGithub } from "react-icons/si";
import Navbar from "./components/Navbar/Navbar";
import NexusMap from "./components/NexusMap/NexusMap";
import heroWorker from "./assets/images/hero-worker.jpg";
import founderPhoto from "./assets/images/ingrid.jpg";

/* ---------- DADOS ---------- */

const timeline = [
  { time: "18h15", label: "Sai de casa" },
  { time: "19h00", label: "Início do turno" },
  { time: "03h00", label: "Fim do expediente" },
  { time: "?", label: "Como voltar para casa?", gap: true },
];

const benefits = [
  { title: "Ida e volta no mesmo turno", text: "O transporte acompanha a escala, inclusive de madrugada." },
  { title: "Pontos Nexus acessíveis", text: "Embarque em locais definidos, com necessidades de acessibilidade já previstas." },
  { title: "Rotas consolidadas", text: "O RH agrupa quem tem turno compatível e o motorista recebe a rota pronta." },
];

// Sempre 3 pontos por polo (o mapa SVG posiciona 3 colunas).
const polos = [
  { name: "CD Guarulhos", city: "Guarulhos", pontos: ["Pimentas", "Bonsucesso", "São João"] },
  { name: "GOODMAN Itaquera", city: "Itaquera, São Paulo", pontos: ["Guaianases", "Cidade Tiradentes", "José Bonifácio"] },
  { name: "Wilson Sons Santo André", city: "Santo André", pontos: ["Vila Luzita", "Utinga", "Capuava"] },
];

const kpis = [
  { value: 92, label: "Pontualidade", text: "Chegadas dentro do horário do turno." },
  { value: 84, label: "Ocupação", text: "Assentos usados por veículo." },
  { value: 96, label: "Acessibilidade", text: "Necessidades atendidas no embarque." },
];

const routeSteps = [
  { title: "Escala cadastrada", text: "O RH informa turnos e quem trabalha em cada um." },
  { title: "Grupo compatível", text: "Pessoas com horário e região parecidos entram na mesma rota." },
  { title: "Rota consolidada", text: "O motorista recebe passageiros, pontos e necessidades." },
];

const profiles = [
  {
    id: "rh",
    title: "RH",
    Icon: ClipboardList,
    description: "Planeja escalas, organiza colaboradores e cria grupos compatíveis para cada operação.",
    actions: ["Cadastra escalas", "Agrupa rotas", "Acompanha a operação"],
  },
  {
    id: "funcionario",
    title: "Funcionário",
    Icon: User,
    description: "Consulta embarque, visualiza ponto Nexus, acessibilidade e confirma presença.",
    actions: ["Vê o turno", "Encontra o ponto de embarque", "Confirma embarque"],
  },
  {
    id: "motorista",
    title: "Motorista",
    Icon: Bus,
    description: "Recebe a rota consolidada, visualiza passageiros e executa a operação.",
    actions: ["Recebe as viagens", "Vê os passageiros", "Conhece as necessidades"],
  },
];

/* ---------- HOOKS ---------- */

function useInView() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, seen];
}

/* ---------- APP ---------- */

function App() {
  const [tab, setTab] = useState(0);
  const [kpiRef, kpiSeen] = useInView();

  const onTabKey = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (tab + dir + profiles.length) % profiles.length;
    setTab(next);
    document.getElementById(`tab-${profiles[next].id}`)?.focus();
  };

  const active = profiles[tab];

  return (
    <>
      <Navbar />

      <main>
        {/* HOME */}
        <section id="home" className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <p className="eyebrow">Mobilidade corporativa para trabalhadores de turno</p>

            <h1 id="hero-title">Quem move a logística também precisa chegar em casa.</h1>

            <p className="hero-subtitle">Trabalhadores, RH e motoristas na mesma rota.</p>

            <p className="hero-description">
              O 99 Nexus é uma extensão do 99 Corporativo criada para ampliar o acesso ao
              trabalho em operações que funcionam 24 horas por dia.
            </p>

            <div className="hero-actions">
              <a href="#solucao" className="btn btn-primary">
                Conheça o Nexus
              </a>
              {/* Troque por o link do MVP quando ele existir */}
              <a href="#jornada" className="btn btn-secondary">
                Ver demonstração
              </a>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-photo-wrapper">
              <img src={heroWorker} alt="Trabalhador de operação logística no fim do turno" />
              <div className="hero-chip" aria-hidden="true">
                <strong>03h10</strong>
                <span> Proximo Nexus sai do ponto de embarque</span>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEMA */}
        <section id="problema" className="section theme-night" aria-labelledby="problema-title">
          <div className="container">
            <p className="eyebrow">O problema</p>
            <h2 id="problema-title" className="h2">
              O turno termina quando o transporte já não está disponível.
            </h2>

            <ol className="timeline">
              {timeline.map((t) => (
                <li key={t.time} className={t.gap ? "tl-gap" : ""}>
                  <strong className="tl-time">{t.time}</strong>
                  <span className="tl-label">{t.label}</span>
                </li>
              ))}
            </ol>

            <p className="problem-closing">
              Quando a volta não existe, o emprego também fica fora do alcance.
            </p>
          </div>
        </section>

        {/* SOLUÇÃO */}
        <section id="solucao" className="section theme-light" aria-labelledby="solucao-title">
          <div className="container solution-grid">
            <div>
              <p className="eyebrow">A solução</p>
              <h2 id="solucao-title" className="h2">
                Mobilidade planejada. Operação conectada.
              </h2>
              <p className="lead">
                O 99 Nexus conecta trabalhadores, RH e motoristas por meio de rotas planejadas
                para cada turno.
              </p>

              <ul className="benefits">
                {benefits.map((b) => (
                  <li key={b.title}>
                    <Check size={20} aria-hidden="true" />
                    <div>
                      <strong>{b.title}</strong>
                      <p>{b.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <figure className="phone-figure">
              <div className="phone" aria-hidden="true">
                <p className="phone-title">Seu turno hoje</p>
                <dl>
                  <div><dt>Turno</dt><dd>19h00 – 03h00</dd></div>
                  <div><dt>Embarque</dt><dd>Ponto Nexus</dd></div>
                  <div><dt>Acessibilidade</dt><dd>Prevista</dd></div>
                </dl>
                <span className="phone-btn">Confirmar embarque</span>
              </div>
              <figcaption>Exemplo ilustrativo da tela do funcionário.</figcaption>
            </figure>
          </div>
        </section>

        {/* MAPA */}
        <section id="mapa" className="section theme-dark" aria-labelledby="mapa-title">
          <div className="container">
            <p className="eyebrow">Onde o Nexus atua</p>
            <h2 id="mapa-title" className="h2">
              Conectando trabalhadores aos principais polos logísticos da Grande São Paulo.
            </h2>

            <NexusMap polos={polos} />

            <div className="map-grid">
              {polos.map((p) => (
                <article key={p.name} className="map-card">
                  <MapPin size={22} aria-hidden="true" />
                  <h3>{p.name}</h3>
                  <p>{p.city}</p>
                  <ul>
                    {p.pontos.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* OPERAÇÃO */}
        <section id="painel" className="section theme-yellow" aria-labelledby="painel-title">
          <div className="container">
            <p className="eyebrow">Operação Nexus</p>
            <h2 id="painel-title" className="h2">
              Planejamento inteligente para turnos de alta demanda.
            </h2>
            <p className="lead">Dados simulados para demonstração. Sem validação operacional em campo.</p>

            <div className="kpis" ref={kpiRef}>
              {kpis.map((k) => (
                <article key={k.label} className="kpi-card">
                  <p className="kpi-value">{k.value}%</p>
                  <h3>{k.label}</h3>
                  <p>{k.text}</p>
                  <div
                    className="progress"
                    role="progressbar"
                    aria-label={k.label}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={k.value}
                  >
                    <div className="progress-fill" style={{ width: kpiSeen ? `${k.value}%` : 0 }} />
                  </div>
                </article>
              ))}
            </div>

            <ol className="route-steps">
              {routeSteps.map((s) => (
                <li key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* JORNADA */}
        <section id="jornada" className="section theme-light" aria-labelledby="jornada-title">
          <div className="container">
            <p className="eyebrow">A jornada</p>
            <h2 id="jornada-title" className="h2">
              Uma experiência contínua para todos os envolvidos.
            </h2>

            <div className="tabs" role="tablist" aria-label="Perfis do Nexus" onKeyDown={onTabKey}>
              {profiles.map((p, i) => (
                <button
                  key={p.id}
                  id={`tab-${p.id}`}
                  role="tab"
                  aria-selected={tab === i}
                  aria-controls={`panel-${p.id}`}
                  tabIndex={tab === i ? 0 : -1}
                  className={tab === i ? "tab is-active" : "tab"}
                  onClick={() => setTab(i)}
                >
                  <p.Icon size={18} aria-hidden="true" />
                  {p.title}
                </button>
              ))}
            </div>

            <div
              id={`panel-${active.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${active.id}`}
              className="tab-panel"
            >
              <active.Icon size={36} aria-hidden="true" />
              <h3>{active.title}</h3>
              <p>{active.description}</p>
              <ul>
                {active.actions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* IDEALIZADORA */}
        <section id="idealizadora" className="section theme-soft" aria-labelledby="ideal-title">
          <div className="container founder-content">
            <div className="founder-photo">
              {founderPhoto ? (
                <img src={founderPhoto} alt="Ingrid Pereira, idealizadora do 99 Nexus" />
              ) : (
                <div className="founder-initials" aria-hidden="true">IP</div>
              )}
            </div>

            <div className="founder-info">
              <p className="eyebrow">Idealizadora</p>
              <h2 id="ideal-title" className="h2">Ingrid Pereira</h2>

              <p className="founder-text">
                O 99 Nexus nasceu durante um hackathon da 99 realizado em parceria com a DiverseMatch Tech, onde participei do Grupo 3 desenvolvendo uma proposta de mobilidade corporativa para profissionais que atuam em diferentes jornadas e turnos.

Após o evento, decidi revisitar o projeto e transformá-lo neste MVP, ampliando a visão inicial para explorar como mobilidade, tecnologia e planejamento podem gerar mais acesso ao trabalho, qualidade de vida e eficiência operacional. O nome Nexus foi escolhido por representar exatamente essa ideia de conexão: entre pessoas, oportunidades, operações e tecnologia.
              </p>
              <p className="founder-text">
                Minha trajetória profissional foi construída em ambientes de atendimento, operações e negócios, desenvolvendo uma visão voltada para transformação digital, melhoria contínua e gestão de projetos. Mais do que a execução técnica, meu foco está em conectar pessoas, processos e tecnologia, traduzindo necessidades de negócio em soluções práticas, compreensíveis e orientadas a resultado.

Sou formada em Administração, possuo formação técnica Full Stack pelo SENAI e atualmente concluo o bootcamp de Cloud Computing da Generation Brasil, com foco na certificação AWS Certified Cloud Practitioner. Acredito no aprendizado contínuo e no uso estratégico das novas tecnologias para gerar valor, eficiência, qualidade e melhor custo-benefício para pessoas e organizações.
              </p>
              <p className="founder-text">
Nesta versão do 99 Nexus, atuei na definição da visão de produto, experiência do usuário, estrutura funcional e evolução do MVP, utilizando metodologias ágeis e ferramentas de Inteligência Artificial, incluindo o Microsoft Copilot, para acelerar prototipação, validação e desenvolvimento.

Tecnologia só gera impacto quando aproxima pessoas de oportunidades.

Gostou?

Vamos nos conectar. 💛
              </p>

              <div className="founder-buttons">
                <a href="https://www.linkedin.com/in/ingridpereira1/" target="_blank" rel="noreferrer" className="btn btn-dark">
                  LinkedIn
                </a>
                <a href="https://github.com/ingridkyle1" target="_blank" rel="noreferrer" className="btn btn-outline">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <h3>99 Nexus</h3>
            <p>Projeto conceitual inspirado em mobilidade corporativa para trabalhadores de turno.</p>
          </div>
          <div>
            <p>Dados simulados. Sem validação operacional em campo.</p>
            <p className="stack-title">Construído com</p>
            <ul className="stack">
              <li><SiReact aria-hidden="true" /> React</li>
              <li><SiVite aria-hidden="true" /> Vite</li>
              <li><Sparkles aria-hidden="true" /> Microsoft Copilot</li>
              <li><SiGithub aria-hidden="true" /> GitHub Pages</li>
            </ul>
          </div>
        </div>
        <small>© Ingrid Pereira</small>
      </footer>
    </>
  );
}

export default App;
