import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, serviceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { error } = await supabase.from("cadastros").insert({
      nome: body.nome,
      cidade: body.cidade,
      renda_bruta: body.rendaBruta,
      possui_fgts: body.possuiFgts,
      fgts_valor: body.fgtsValor,
      entrada_disponivel: body.entradaDisponivel,
      usa_bens_na_entrada: body.usaBensNaEntrada,
      bens_descricao: body.bensDescricao,
      tem_terreno: body.temTerreno,
      terreno_local: body.terrenoLocal,
      terreno_quitado: body.terrenoQuitado,
      terreno_saldo_devedor: body.terrenoSaldoDevedor,
      bairro_interesse: body.bairroInteresse,
      quartos: body.quartos,
      quartos_customizado: body.quartosCustomizado,
      possui_financiamento_atual: body.possuiFinanciamentoAtual,
      quais_financiamentos: body.quaisFinanciamentos,
      regime_trabalho: body.regimeTrabalho,
      tem_imovel_no_nome: body.temImovelNoNome,
      whatsapp: body.whatsapp,
      origem: body.origem,
    });
    if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok:true });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message || "erro" }, { status: 500 });
  }
}
