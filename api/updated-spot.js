const admin = require("firebase-admin");

// Evita inicializar o Firebase várias vezes na Vercel
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // O .replace garante que as quebras de linha (\n) da chave funcionem corretamente
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    }),
    // ATENÇÃO: Substitua a URL abaixo pela URL real do seu Firebase Realtime Database
    databaseURL: "https://SEU_BANCO_DE_DADOS_AQUI.firebaseio.com" 
  });
}

const db = admin.database();

export default async function handler(req, res) {
  // Configurações de CORS para permitir acesso do Seeeduino e do seu app Android
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Responde imediatamente a verificações de segurança (Preflight do CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Processa os dados enviados pelo Seeeduino
  if (req.method === 'POST') {
    const { spotId, status } = req.body;

    // Validação para garantir que os dados não vieram vazios
    if (!spotId || !status) {
      return res.status(400).json({ error: 'Faltam dados: spotId ou status' });
    }

    try {
      // Grava a informação no Firebase no formato: vagas -> nome_da_vaga -> status
      await db.ref(`vagas/${spotId}`).set({
        status: status,
        ultimaAtualizacao: new Date().toISOString()
      });

      // Retorna sucesso para o hardware
      return res.status(200).json({ 
        success: true, 
        message: 'Status gravado no Firebase com sucesso!' 
      });
      
    } catch (error) {
      console.error('Erro ao gravar no Firebase:', error);
      return res.status(500).json({ error: 'Erro interno ao gravar no banco de dados' });
    }
  } else {
    // Bloqueia qualquer método que não seja POST (como abrir o link direto no navegador)
    return res.status(405).json({ error: 'Método HTTP não permitido. Use POST.' });
  }
}
