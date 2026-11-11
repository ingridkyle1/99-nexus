// Mapa esquemático (não geográfico): cada polo logístico recebe seus Pontos Nexus.
// Salve em src/components/NexusMap/NexusMap.jsx

const XS = [140, 400, 660]; // posição horizontal dos 3 pontos de cada polo
const TOP = 130; // altura do primeiro polo
const ROW = 210; // distância entre polos

export default function NexusMap({ polos }) {
  const description = polos
    .map((p) => `${p.name}: ${p.pontos.join(", ")}`)
    .join(". ");

  return (
    <svg
      className="map-svg"
      viewBox="0 0 800 600"
      role="img"
      aria-label={`Mapa esquemático dos Pontos Nexus. ${description}.`}
    >
      {polos.map((polo, i) => {
        const hubY = TOP + i * ROW;
        const pointY = hubY - 90;

        return (
          <g key={polo.name}>
            {polo.pontos.map((ponto, j) => {
              const x = XS[j];
              return (
                <g key={ponto}>
                  <path
                    className="map-line"
                    d={`M${x} ${pointY + 9} C${x} ${pointY + 50} 400 ${hubY - 70} 400 ${hubY - 31}`}
                  />
                  <circle className="map-dot" cx={x} cy={pointY} r="9" />
                  <text className="map-point-label" x={x} y={pointY - 20} textAnchor="middle">
                    {ponto}
                  </text>
                </g>
              );
            })}

            <rect className="map-hub" x="250" y={hubY - 31} width="300" height="62" rx="18" />
            <text className="map-hub-name" x="400" y={hubY - 3} textAnchor="middle">
              {polo.name}
            </text>
            <text className="map-hub-city" x="400" y={hubY + 18} textAnchor="middle">
              {polo.city}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
