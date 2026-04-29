// Arquivo: api/update-spot.js

export default function handler(req, res) {
  // Configurações de CORS para garantir que a requisição seja aceita
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Responde imediatamente a requisições OPTIONS (Preflight do CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Só aceitamos requisições POST vindas do Seeeduino
  if (req.method === 'POST') {
    try {
      // Extrai os dados enviados pelo Seeeduino
      const { spotId, status } = req.body;

      if (!spotId || !status) {
        return res.status(400).json({ error: 'Faltam parametros: spotId ou status' });
      }

      console.log(`[LOG] Atualização recebida -> Vaga: ${spotId} | Novo Status: ${status}`);

      // ====================================================================
      // AQUI ENTRA A LÓGICA DO SEU BANCO DE DADOS
      // Exemplo: Atualizar no MongoDB, Supabase, Firebase Firestore, etc.
      // await db.collection('vagas').updateOne({ id: spotId }, { $set: { status: status } });
      // ====================================================================

      // Retorna sucesso para o Seeeduino
      return res.status(200).json({ success: true, message: 'Status atualizado com sucesso' });

    } catch (error) {
      console.error('Erro ao processar requisição:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    // Se tentar acessar a URL pelo navegador (GET), avisa que o método é inválido
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }
}