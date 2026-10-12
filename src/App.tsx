import { useState, useMemo } from "react";

// ── Tipos ──────────────────────────────────────────────────────────────────

type Categoria =
  | "Analgésico"
  | "Antibiótico"
  | "Anti-inflamatório"
  | "Vitamina"
  | "Antialérgico"
  | "Antihipertensivo";

interface Remedio {
  codigo: number;
  nome: string;
  categoria: Categoria;
  descricao: string;
}

interface ResultadoBusca {
  remedio: Remedio | null;
  algoritmo: "Busca Binária" | "Busca Sequencial";
  passos: number;
  encontrado: boolean;
}

// ── Constantes & Dados ─────────────────────────────────────────────────────

const CATEGORIAS: Categoria[] = [
  "Analgésico",
  "Antibiótico",
  "Anti-inflamatório",
  "Vitamina",
  "Antialérgico",
  "Antihipertensivo",
];

const COR: Record<Categoria, string> = {
  "Analgésico": "#22d3ee",
  "Antibiótico": "#a78bfa",
  "Anti-inflamatório": "#fb923c",
  "Vitamina": "#34d399",
  "Antialérgico": "#f472b6",
  "Antihipertensivo": "#facc15",
};

// Expandido para 33 remédios para testar o Radix Sort em escala
const REMEDIOS_INICIAIS: Remedio[] = [
  { codigo: 101, nome: "Paracetamol 500mg", categoria: "Analgésico", descricao: "Alívio de dores leves e febre" },
  { codigo: 102, nome: "Dipirona 1g", categoria: "Analgésico", descricao: "Analgésico e antitérmico" },
  { codigo: 103, nome: "Aspirina 500mg", categoria: "Analgésico", descricao: "Alívio de dores e inflamações" },
  { codigo: 104, nome: "Torsilax 30mg", categoria: "Analgésico", descricao: "Relaxante muscular" },
  { codigo: 105, nome: "Novalgina 1g", categoria: "Analgésico", descricao: "Febre e dores fortes" },
  { codigo: 106, nome: "Ibuprofeno 400mg", categoria: "Analgésico", descricao: "Dor de cabeça crônica" },
  { codigo: 201, nome: "Amoxicilina 500mg", categoria: "Antibiótico", descricao: "Infecções bacterianas" },
  { codigo: 202, nome: "Azitromicina 500mg", categoria: "Antibiótico", descricao: "Infecções respiratórias" },
  { codigo: 203, nome: "Cefalexina 500mg", categoria: "Antibiótico", descricao: "Infecções de pele e urinária" },
  { codigo: 204, nome: "Clavulin 875mg", categoria: "Antibiótico", descricao: "Amoxicilina + Clavulanato" },
  { codigo: 205, nome: "Bactrim F 800mg", categoria: "Antibiótico", descricao: "Infecções respiratórias" },
  { codigo: 206, nome: "Ciprofloxacino 500mg", categoria: "Antibiótico", descricao: "Infecções sistêmicas" },
  { codigo: 301, nome: "Ibuprofeno 600mg", categoria: "Anti-inflamatório", descricao: "Inflamações musculares" },
  { codigo: 302, nome: "Nimesulida 100mg", categoria: "Anti-inflamatório", descricao: "Inflamações em geral" },
  { codigo: 303, nome: "Diclofenaco 50mg", categoria: "Anti-inflamatório", descricao: "Artrite" },
  { codigo: 304, nome: "Celecoxibe 200mg", categoria: "Anti-inflamatório", descricao: "Dores articulares" },
  { codigo: 305, nome: "Meloxicam 15mg", categoria: "Anti-inflamatório", descricao: "Osteoartrite" },
  { codigo: 401, nome: "Vitamina C 1000mg", categoria: "Vitamina", descricao: "Suplementação de vitamina C" },
  { codigo: 402, nome: "Vitamina D3 2000UI", categoria: "Vitamina", descricao: "Suplementação de vitamina D" },
  { codigo: 403, nome: "Vitamina B12 1000mcg", categoria: "Vitamina", descricao: "Saúde neurológica" },
  { codigo: 404, nome: "Complexo B", categoria: "Vitamina", descricao: "Metabolismo e energia" },
  { codigo: 405, nome: "Zinco 29mg", categoria: "Vitamina", descricao: "Imunidade celular" },
  { codigo: 406, nome: "Vitamina E 400UI", categoria: "Vitamina", descricao: "Antioxidante" },
  { codigo: 501, nome: "Loratadina 10mg", categoria: "Antialérgico", descricao: "Alergias e rinite" },
  { codigo: 502, nome: "Cetirizina 10mg", categoria: "Antialérgico", descricao: "Alergias e urticária" },
  { codigo: 503, nome: "Fexofenadina 120mg", categoria: "Antialérgico", descricao: "Rinite alérgica" },
  { codigo: 504, nome: "Desloratadina 5mg", categoria: "Antialérgico", descricao: "Sem sono" },
  { codigo: 505, nome: "Dexclorfeniramina 2mg", categoria: "Antialérgico", descricao: "Alergias intensas" },
  { codigo: 601, nome: "Losartana 50mg", categoria: "Antihipertensivo", descricao: "Pressão arterial" },
  { codigo: 602, nome: "Enalapril 10mg", categoria: "Antihipertensivo", descricao: "Hipertensão" },
  { codigo: 603, nome: "Atenolol 50mg", categoria: "Antihipertensivo", descricao: "Betabloqueador cardíaco" },
  { codigo: 604, nome: "Captopril 25mg", categoria: "Antihipertensivo", descricao: "Pressão alta de emergência" },
  { codigo: 605, nome: "Amlodipina 5mg", categoria: "Antihipertensivo", descricao: "Controle prolongado" },
];

// ── Algoritmos de Busca ────────────────────────────────────────────────────

function buscaBinariaPorCodigo(lista: Remedio[], codigo: number): ResultadoBusca {
  const ordenada = countingSortPorCodigo(lista);
  let baixo = 0;
  let alto = ordenada.length - 1;
  let passos = 0;

  while (baixo <= alto) {
    passos++;
    const meio = Math.floor((baixo + alto) / 2);
    if (ordenada[meio].codigo === codigo) {
      return { remedio: ordenada[meio], algoritmo: "Busca Binária", passos, encontrado: true };
    } else if (ordenada[meio].codigo < codigo) {
      baixo = meio + 1;
    } else {
      alto = meio - 1;
    }
  }
  return { remedio: null, algoritmo: "Busca Binária", passos, encontrado: false };
}

function buscaSequencialPorNome(lista: Remedio[], nome: string): ResultadoBusca {
  const termo = nome.toLowerCase().trim();
  let passos = 0;

  for (const r of lista) {
    passos++;
    if (r.nome.toLowerCase().includes(termo)) {
      return { remedio: r, algoritmo: "Busca Sequencial", passos, encontrado: true };
    }
  }
  return { remedio: null, algoritmo: "Busca Sequencial", passos, encontrado: false };
}

// ── Algoritmo de Ordenação: Radix Sort MSD ─────────────────────────────────

/**
 * Ordena os remédios pelo nome comparando caractere por caractere a partir do primeiro (MSD).
 */
function radixSortMSD(lista: Remedio[], index: number = 0): Remedio[] {
  // Condição de parada: se a lista tem 1 ou 0 elementos, já está ordenada.
  if (lista.length <= 1) return lista;

  // Criamos 257 "buckets" (baldes).
  // O índice 0 será para strings que já acabaram (comprimento menor que o index atual).
  // Os índices 1 a 256 representam os caracteres na tabela ASCII.
  const buckets: Remedio[][] = Array.from({ length: 257 }, () => []);

  for (const item of lista) {
    // Melhoria Profissional: Normalizar a string para ignorar acentos e transformar em minúscula
    // Isso evita que "Ácido" vá parar depois de "Zinco" na tabela ASCII.
    const nomeNormalizado = item.nome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos (acentos)
      .toLowerCase();

    if (index >= nomeNormalizado.length) {
      // Se já verificamos todos os caracteres dessa palavra, ela vai pro balde 0
      buckets[0].push(item);
    } else {
      // Pegamos o valor ASCII do caractere atual. Somamos 1 para pular o balde 0.
      const charCode = nomeNormalizado.charCodeAt(index);
      // Evitamos estouro de array caso haja um caractere muito estranho fora do range normal
      const bucketIndex = charCode < 256 ? charCode + 1 : 256;
      buckets[bucketIndex].push(item);
    }
  }

  // As strings do balde 0 já estão prontas (são mais curtas que as outras)
  let resultado: Remedio[] = [...buckets[0]];

  // Para os baldes de 1 a 256, chamamos a função recursivamente para o próximo caractere
  for (let i = 1; i <= 256; i++) {
    if (buckets[i].length > 0) {
      resultado = resultado.concat(radixSortMSD(buckets[i], index + 1));
    }
  }

  return resultado;
}

// ── Algoritmo de Ordenação: Counting Sort ───────────────────────────────────

/**
 * Ordena os remédios pelo código em ordem crescente.
 * Mantém os objetos completos e não modifica a lista original.
 * Complexidade de tempo e espaço: O(n + k),
 * sendo k = maior código - menor código + 1.
 */
function countingSortPorCodigo(lista: Remedio[]): Remedio[] {
  if (lista.length === 0) return [];

  // Descobre o intervalo dos códigos.
  let menor = lista[0].codigo;
  let maior = lista[0].codigo;

  for (const remedio of lista) {
    if (remedio.codigo < menor) menor = remedio.codigo;
    if (remedio.codigo > maior) maior = remedio.codigo;
  }

  const contagem: number[] = new Array(maior - menor + 1).fill(0);

  // Conta quantas vezes cada código aparece.
  for (const remedio of lista) {
    contagem[remedio.codigo - menor]++;
  }

  // Acumula as contagens para descobrir as posições de saída.
  for (let i = 1; i < contagem.length; i++) {
    contagem[i] += contagem[i - 1];
  }

  const ordenada: Remedio[] = new Array(lista.length);

  // Percorre de trás para frente para preservar a estabilidade.
  for (let i = lista.length - 1; i >= 0; i--) {
    const remedio = lista[i];
    const indice = remedio.codigo - menor;

    contagem[indice]--;
    ordenada[contagem[indice]] = remedio;
  }

  return ordenada;
}

// ── Componente Principal ───────────────────────────────────────────────────

export default function App() {
  const [remedios, setRemedios] = useState<Remedio[]>(REMEDIOS_INICIAIS);
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria | "Todos">("Todos");
  const [aba, setAba] = useState<"catalogo" | "busca">("catalogo");

  // Controle de Ordenação na Interface
  const [ordenacao, setOrdenacao] = useState<"codigo" | "nome">("codigo");

  // Busca
  const [modoBusca, setModoBusca] = useState<"codigo" | "nome">("codigo");
  const [campoBusca, setCampoBusca] = useState("");
  const [resultado, setResultado] = useState<ResultadoBusca | null>(null);

  // Cadastro
  const [novoCodigo, setNovoCodigo] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [novaCategoria, setNovaCategoria] = useState<Categoria>("Analgésico");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [erroForm, setErroForm] = useState("");

  // Fluxo de filtragem e ordenação
  const remediosExibidos = useMemo(() => {
    // 1. Primeiro filtra pela categoria
    const filtrados = remedios.filter(
      (r) => categoriaAtiva === "Todos" || r.categoria === categoriaAtiva
    );

    // 2. Depois aplica a ordenação
    if (ordenacao === "nome") {
      return radixSortMSD(filtrados);
    } else {
      // Ordenação por código usando Counting Sort
      return countingSortPorCodigo(filtrados);
    }
  }, [remedios, categoriaAtiva, ordenacao]);

  const executarBusca = () => {
    if (!campoBusca.trim()) return;
    if (modoBusca === "codigo") {
      const codigo = parseInt(campoBusca, 10);
      if (isNaN(codigo)) return;
      setResultado(buscaBinariaPorCodigo(remedios, codigo));
    } else {
      setResultado(buscaSequencialPorNome(remedios, campoBusca));
    }
  };

  const adicionar = () => {
    const codigo = parseInt(novoCodigo, 10);
    if (isNaN(codigo) || codigo <= 0) { setErroForm("Informe um código válido."); return; }
    if (remedios.some((r) => r.codigo === codigo)) { setErroForm("Código já cadastrado."); return; }
    if (!novoNome.trim()) { setErroForm("Informe o nome do remédio."); return; }

    setErroForm("");
    setRemedios((prev) => [
      ...prev,
      { codigo, nome: novoNome.trim(), categoria: novaCategoria, descricao: novaDescricao.trim() }
    ]);
    setNovoCodigo(""); setNovoNome(""); setNovaDescricao("");
  };

  const excluir = (codigo: number) => {
    setRemedios((prev) => prev.filter((r) => r.codigo !== codigo));
    if (resultado?.remedio?.codigo === codigo) setResultado(null);
  };

  return (
    <div className="min-h-full flex flex-col" style={{ background: "#0b0b10", fontFamily: "'Outfit', sans-serif", color: "#e2e8f0" }}>
      {/* Cabeçalho */}
      <header className="px-6 py-4 flex items-center justify-between flex-wrap gap-3" style={{ borderBottom: "1px solid #1a1a28" }}>
        <div>
          <h1 className="text-xl font-bold">Catálogo de Remédios</h1>
          <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{remedios.length} remédios cadastrados</p>
        </div>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: "#13131e", border: "1px solid #1a1a28" }}>
          {([["catalogo", "Catálogo"], ["busca", "Busca"]] as const).map(([v, l]) => (
            <button
              key={v}
              onClick={() => setAba(v)}
              className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
              style={{ background: aba === v ? "#1e1e2e" : "transparent", color: aba === v ? "#e2e8f0" : "#475569" }}
            >
              {l}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Lateral */}
        <aside className="w-full lg:w-64 p-5 space-y-6 flex-shrink-0" style={{ borderRight: "1px solid #1a1a28" }}>
          {/* Categorias */}
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: "#475569" }}>Categoria</p>
            <div className="space-y-0.5">
              {(["Todos", ...CATEGORIAS] as (Categoria | "Todos")[]).map((cat) => {
                const cor = cat === "Todos" ? "#64748b" : COR[cat as Categoria];
                const ativo = categoriaAtiva === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoriaAtiva(cat)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-all"
                    style={{
                      background: ativo ? `${cor}15` : "transparent",
                      color: ativo ? cor : "#64748b",
                    }}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cor }} />
                    {cat}
                    {cat !== "Todos" && (
                      <span className="ml-auto text-xs" style={{ color: ativo ? cor : "#334155" }}>
                        {remedios.filter((r) => r.categoria === cat).length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cadastro */}
          <div className="space-y-2.5 pt-5" style={{ borderTop: "1px solid #1a1a28" }}>
            <p className="text-xs font-medium" style={{ color: "#475569" }}>Novo remédio</p>
            <input type="number" placeholder="Código" value={novoCodigo} onChange={(e) => setNovoCodigo(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={{ background: "#13131e", border: "1px solid #1e1e2e", color: "#e2e8f0" }} />
            <input type="text" placeholder="Nome" value={novoNome} onChange={(e) => setNovoNome(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={{ background: "#13131e", border: "1px solid #1e1e2e", color: "#e2e8f0" }} />
            <select value={novaCategoria} onChange={(e) => setNovaCategoria(e.target.value as Categoria)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={{ background: "#13131e", border: "1px solid #1e1e2e", color: "#94a3b8" }}>
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="text" placeholder="Descrição (opcional)" value={novaDescricao} onChange={(e) => setNovaDescricao(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={{ background: "#13131e", border: "1px solid #1e1e2e", color: "#e2e8f0" }} />
            {erroForm && <p className="text-xs" style={{ color: "#ef4444" }}>{erroForm}</p>}
            <button onClick={adicionar} className="w-full py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: "#22d3ee22", color: "#22d3ee", border: "1px solid #22d3ee33" }}>
              Cadastrar
            </button>
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 p-5">
          {/* CATÁLOGO */}
          {aba === "catalogo" && (
            <>
              {/* Controle de Ordenação */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Inventário</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span style={{ color: "#64748b" }}>Ordenar por:</span>
                  <select
                    value={ordenacao}
                    onChange={(e) => setOrdenacao(e.target.value as "codigo" | "nome")}
                    className="bg-[#13131e] border border-[#1e1e2e] rounded-md px-3 py-1 outline-none text-[#e2e8f0]"
                  >
                    <option value="codigo">Código (Counting Sort)</option>
                    <option value="nome">Nome (Radix Sort)</option>
                  </select>
                </div>
              </div>

              {remediosExibidos.length === 0 ? (
                <p className="text-sm mt-8 text-center" style={{ color: "#334155" }}>Nenhum remédio nesta categoria.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {remediosExibidos.map((r) => {
                    const cor = COR[r.categoria];
                    return (
                      <div key={r.codigo} className="group relative rounded-xl p-4 flex flex-col gap-2 transition-all hover:bg-[#1a1a28]"
                        style={{ background: "#13131e", border: "1px solid #1a1a28" }}>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ background: `${cor}18`, color: cor }}>
                            {r.categoria}
                          </span>
                          <button onClick={() => excluir(r.codigo)}
                            className="opacity-0 group-hover:opacity-100 text-xs transition-opacity px-1.5 py-0.5 rounded"
                            style={{ color: "#ef4444", background: "#ef444415" }}>✕</button>
                        </div>
                        <p className="font-semibold text-sm" style={{ color: "#e2e8f0" }}>{r.nome}</p>
                        {r.descricao && <p className="text-xs" style={{ color: "#475569" }}>{r.descricao}</p>}
                        <div className="mt-auto pt-2 flex items-center justify-between" style={{ borderTop: "1px solid #1a1a28" }}>
                          <span className="text-xs" style={{ color: "#334155" }}>Código</span>
                          <span className="text-sm font-bold" style={{ color: cor }}>{r.codigo}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {}
          {aba === "busca" && (
            <div className="max-w-xl mx-auto space-y-5 mt-4">
              <div className="grid grid-cols-2 gap-3">
                {([
                  { modo: "codigo" as const, titulo: "Busca Binária", subtitulo: "Por código", descricao: "Divide a lista ordenada ao meio.", complexidade: "O(log n)", cor: "#22d3ee" },
                  { modo: "nome" as const, titulo: "Busca Sequencial", subtitulo: "Por nome", descricao: "Percorre um por um.", complexidade: "O(n)", cor: "#a78bfa" },
                ]).map(({ modo, titulo, subtitulo, descricao, complexidade, cor }) => (
                  <button
                    key={modo}
                    onClick={() => { setModoBusca(modo); setResultado(null); setCampoBusca(""); }}
                    className="text-left p-4 rounded-xl transition-all"
                    style={{
                      background: modoBusca === modo ? `${cor}12` : "#13131e",
                      border: `1px solid ${modoBusca === modo ? cor + "44" : "#1a1a28"}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold" style={{ color: modoBusca === modo ? cor : "#94a3b8" }}>{titulo}</span>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: `${cor}15`, color: cor }}>{complexidade}</span>
                    </div>
                    <p className="text-xs font-medium mb-1" style={{ color: "#475569" }}>{subtitulo}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "#334155" }}>{descricao}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type={modoBusca === "codigo" ? "number" : "text"}
                  placeholder={modoBusca === "codigo" ? "Digite o código (ex: 302)" : "Digite o nome (ex: Ibuprofeno)"}
                  value={campoBusca}
                  onChange={(e) => { setCampoBusca(e.target.value); setResultado(null); }}
                  onKeyDown={(e) => e.key === "Enter" && executarBusca()}
                  className="flex-1 rounded-lg px-4 py-2.5 text-sm outline-none" style={{ background: "#13131e", border: "1px solid #1e1e2e", color: "#e2e8f0" }}
                />
                <button onClick={executarBusca} className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: "#22d3ee22", color: "#22d3ee", border: "1px solid #22d3ee33" }}>Buscar</button>
              </div>

              {resultado && (
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${resultado.encontrado ? "#22d3ee33" : "#ef444433"}` }}>
                  <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-2"
                    style={{ background: resultado.encontrado ? "#22d3ee0d" : "#ef44440d" }}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: resultado.encontrado ? "#22d3ee" : "#ef4444" }}>
                        {resultado.encontrado ? "Encontrado" : "Não encontrado"}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#1e1e2e", color: "#64748b" }}>{resultado.algoritmo}</span>
                    </div>
                    <span className="text-xs" style={{ color: "#475569" }}>{resultado.passos} comparações</span>
                  </div>
                  {resultado.remedio ? (
                    <div className="p-4 space-y-3" style={{ background: "#13131e" }}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${COR[resultado.remedio.categoria]}18`, color: COR[resultado.remedio.categoria] }}>
                          {resultado.remedio.categoria}
                        </span>
                        <span className="text-lg font-bold" style={{ color: COR[resultado.remedio.categoria] }}>{resultado.remedio.codigo}</span>
                      </div>
                      <p className="font-semibold" style={{ color: "#e2e8f0" }}>{resultado.remedio.nome}</p>
                    </div>
                  ) : (
                    <div className="p-4" style={{ background: "#13131e" }}>
                      <p className="text-sm" style={{ color: "#475569" }}>Nenhum remédio corresponde à busca.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}