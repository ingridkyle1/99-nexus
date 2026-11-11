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
  { title: "Volta para casa na madrugada", text: "Rotas compartilhadas saem do centro de distribuição ao fim do turno, quando a cobertura tradicional nem sempre chega." },
  { title: "Pontos Nexus no bairro", text: "O trabalhador desce em um ponto a cerca de 2 km de casa, e cada grupo é formado por proximidade." },
  { title: "Complementa o fretado", text: "Cobre os horários e as regiões que o fretado não alcança, sem substituir o que já funciona." },
];

const gaps = [
  { title: "Cobertura que não alcança", text: "Na madrugada, o fretado nem sempre chega às regiões onde o trabalhador mora." },
  { title: "Veículo com assento vazio", text: "Com menos gente no horário, o custo por passageiro sobe e o veículo roda subutilizado." },
  { title: "Polos distantes e periferia", text: "Muitos centros ficam longe dos bairros onde o trabalhador mora, em regiões de periferia." },
];

const impacts = [
  "Vagas abertas nos centros de distribuição",
  "Evasão nos turnos da noite",
  "Menos qualidade de vida para quem trabalha",
];

const howSteps = [
  { title: "Fim do turno", text: "O trabalhador embarca no centro de distribuição, às 03h00." },
  { title: "Rota compartilhada", text: "Quem mora na mesma região viaja junto, em grupos formados por proximidade." },
  { title: "Ponto Nexus", text: "Desce no ponto do bairro, a cerca de 2 km de casa." },
];

const valueCols = [
  { title: "RH", text: "Menos vagas abertas e menos evasão nos turnos da noite." },
  { title: "Trabalhador", text: "Volta segura para casa, mais acesso ao trabalho e mais qualidade de vida." },
  { title: "Operação", text: "Melhor custo-benefício e mais eficiência, com ocupação planejada." },
];

const compare = [
  { k: "Rota", a: "Fixa, definida de antemão", b: "Compartilhada, planejada por turno" },
  { k: "Madrugada", a: "Cobertura nem sempre disponível", b: "Foco na volta do fim do turno" },
  { k: "Ocupação", a: "Pode rodar com assentos vazios", b: "Grupos formados por proximidade" },
  { k: "Destino", a: "Depende do trajeto do fretado", b: "Ponto Nexus a cerca de 2 km de casa" },
];

const future = [
  { title: "Hoje", text: "Carros com motoristas, em rotas compartilhadas." },
  { title: "Próximo passo", text: "Vans para grupos maiores, ajustando o veículo à demanda." },
  { title: "Longo prazo", text: "Veículos maiores e mais polos logísticos." },
];

const houses = [[60, 70], [160, 58], [172, 140], [92, 168], [48, 130], [136, 92]];

// Sempre 3 pontos por polo (o mapa SVG posiciona 3 colunas).
const polos = [
  { name: "CD Guarulhos", city: "Guarulhos", pontos: ["Pimentas", "Bonsucesso", "São João"] },
  { name: "GOODMAN Itaquera", city: "Itaquera, São Paulo", pontos: ["Guaianases", "Cidade Tiradentes", "José Bonifácio"] },
  { name: "Wilson Sons Santo André", city: "Santo André", pontos: ["Vila Luzita", "Utinga", "Capuava"] },
];

const kpis = [
  { value: 92, label: "Pontualidade", text: "Chegadas dentro do horário do turno." },
  { value: 84, label: "Ocupação", text: "Assentos usados por veículo." },
  { value: 96, label: "Acessibilidade", text: "Necessidades de acessibilidade atendidas." },
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
    description: "Consulta o horário da volta, vê o Ponto Nexus do bairro, informa acessibilidade e confirma presença.",
    actions: ["Vê o horário da volta", "Encontra o Ponto Nexus", "Confirma presença"],
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
              trabalho em operações que funcionam 24 horas por dia. Foco na volta para casa de quem encerra o turno na madrugada.
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
                <span>Nexus sai do centro de distribuição rumo ao seu bairro</span>
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

            <p className="lead">
              A ida acontece em horário comum, com transporte público ou fretado. O problema é a
              volta, quando o turno acaba na madrugada.
            </p>

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

            <div className="gap-block">
              <h3 className="h3">Mas a empresa já não tem fretado?</h3>
              <p className="lead">
                Tem, e o Nexus não quer substituí-lo. Mas na madrugada a demanda costuma ser menor
                e a cobertura tradicional muitas vezes não alcança determinadas regiões.
              </p>

              <div className="gap-grid">
                {gaps.map((g) => (
                  <article key={g.title} className="gap-card">
                    <h4>{g.title}</h4>
                    <p>{g.text}</p>
                  </article>
                ))}
              </div>

              <div className="impact">
                <p className="impact-title">O efeito na operação</p>
                <ul>
                  {impacts.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SOLUÇÃO */}
        <section id="solucao" className="section theme-light" aria-labelledby="solucao-title">
          <div className="container">
            <div className="solution-grid">
            <div>
              <p className="eyebrow">A solução</p>
              <h2 id="solucao-title" className="h2">
                Mobilidade planejada. Operação conectada.
              </h2>
              <p className="lead">
                O 99 Nexus é uma solução de mobilidade corporativa para trabalhadores de turno. Ele complementa modelos já existentes, como o fretado, e amplia o acesso ao trabalho em horários e regiões onde a mobilidade ainda é um desafio.
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
                <p className="phone-title">Sua volta hoje</p>
                <dl>
                  <div><dt>Saída do turno</dt><dd>03h00</dd></div>
                  <div><dt>Desembarque</dt><dd>Ponto Nexus</dd></div>
                  <div><dt>Acessibilidade</dt><dd>Prevista</dd></div>
                </dl>
                <span className="phone-btn">Confirmar volta</span>
              </div>
              <figcaption>Exemplo ilustrativo da tela do funcionário.</figcaption>
            </figure>
            </div>

            <div className="how">
              <figure className="radius-figure">
                <svg
                  viewBox="0 0 220 220"
                  role="img"
                  aria-label="Um Ponto Nexus no centro e casas ao redor, dentro de um raio de cerca de 2 quilômetros"
                >
                  <circle className="radius-ring" cx="110" cy="110" r="96" />
                  {houses.map(([x, y]) => (
                    <circle key={`${x}-${y}`} className="radius-house" cx={x} cy={y} r="6" />
                  ))}
                  <circle className="radius-core" cx="110" cy="110" r="16" />
                  <text className="radius-n" x="110" y="116" textAnchor="middle">N</text>
                </svg>
                <figcaption>Raio de cerca de 2 km ao redor do Ponto Nexus (ilustrativo).</figcaption>
              </figure>

              <div>
                <h3 className="h3">Como funciona a volta</h3>
                <ol className="how-steps">
                  {howSteps.map((h) => (
                    <li key={h.title}>
                      <strong>{h.title}</strong>
                      <p>{h.text}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="values">
              {valueCols.map((v) => (
                <article key={v.title} className="value-card">
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </article>
              ))}
            </div>

            <table className="compare">
              <caption>Comparação conceitual. Cada operação tem suas particularidades.</caption>
              <thead>
                <tr>
                  <th scope="col">Critério</th>
                  <th scope="col">Fretado tradicional</th>
                  <th scope="col">99 Nexus</th>
                </tr>
              </thead>
              <tbody>
                {compare.map((r) => (
                  <tr key={r.k}>
                    <th scope="row">{r.k}</th>
                    <td>{r.a}</td>
                    <td>{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="future">
              <p className="eyebrow">Visão de futuro</p>
              <h3 className="h3">Uma ideia para crescer</h3>
              <ol className="future-steps">
                {future.map((f) => (
                  <li key={f.title}>
                    <strong>{f.title}</strong>
                    <p>{f.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* MAPA */}
        <section id="mapa" className="section theme-dark" aria-labelledby="mapa-title">
          <div className="container">
            <p className="eyebrow">Onde o Nexus atua</p>
            <h2 id="mapa-title" className="h2">
              Conectando trabalhadores aos principais polos logísticos da Grande São Paulo.
            </h2>

            <p className="lead">
              Polos distantes e bairros de periferia entram no mapa. A rota sai do centro de
              distribuição e deixa o trabalhador no Ponto Nexus do seu bairro.
            </p>

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
              </p>
              <p className="founder-text">
                Após o evento, decidi revisitar o projeto e transformá-lo neste MVP, ampliando a visão inicial para explorar como mobilidade, tecnologia e planejamento podem gerar mais acesso ao trabalho, qualidade de vida e eficiência operacional. O nome Nexus foi escolhido por representar exatamente essa ideia de conexão: entre pessoas, oportunidades, operações e tecnologia.
              </p>
              <p className="founder-text">
                Minha trajetória profissional foi construída em ambientes de atendimento, operações e negócios, desenvolvendo uma visão voltada para transformação digital, melhoria contínua e gestão de projetos. Mais do que a execução técnica, meu foco está em conectar pessoas, processos e tecnologia, traduzindo necessidades de negócio em soluções práticas, compreensíveis e orientadas a resultado.
              </p>
              <p className="founder-text">
                Sou formada em Administração, possuo formação técnica Full Stack pelo SENAI e atualmente concluo o bootcamp de Cloud Computing da Generation Brasil, com foco na certificação AWS Certified Cloud Practitioner. Acredito no aprendizado contínuo e no uso estratégico das novas tecnologias para gerar valor, eficiência, qualidade e melhor custo-benefício para pessoas e organizações.
              </p>
              <p className="founder-text">
                Nesta versão do 99 Nexus, atuei na definição da visão de produto, experiência do usuário, estrutura funcional e evolução do MVP, utilizando metodologias ágeis e ferramentas de Inteligência Artificial, incluindo o Microsoft Copilot, para acelerar prototipação, validação e desenvolvimento.
              </p>
              <p className="founder-quote">
                Tecnologia só gera impacto quando aproxima pessoas de oportunidades.
              </p>
              <p className="founder-text">Gostou? Vamos nos conectar. 💛</p>

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
