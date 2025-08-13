const express = require('express');
const { XeroClient } = require('xero-node');
require('dotenv').config({ path: '.env-xero' });

const app = express();
const port = process.env.PORT || 3003;

const xero = new XeroClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUris: [`http://localhost:${port}/callback`],
  scopes: 'openid profile email accounting.settings accounting.transactions offline_access'.split(" "),
  state: 'returnPage=my-sweet-dashboard', // custom params (optional)
  httpTimeout: 3000, // ms (optional)
  clockTolerance: 10 // seconds (optional)
});

app.get('/', (req, res) => {
  res.send(`
    <h1>Xero SDK Test Server</h1>
    <p>Сервер запущен на порту ${port}</p>
    <p><a href="/connect">Подключиться к Xero</a></p>
    <p><a href="/status">Проверить статус подключения</a></p>
  `);
});

app.get('/connect', async (req, res) => {
  try {
    const consentUrl = await xero.buildConsentUrl();
    console.log('Consent URL:', consentUrl);
    res.redirect(consentUrl);
  } catch (error) {
    console.error('Ошибка при создании consent URL:', error);
    res.status(500).send('Ошибка при создании ссылки для авторизации');
  }
});

app.get('/callback', async (req, res) => {
  try {
    const tokenSet = await xero.apiCallback(req.url);
    console.log('Token set получен:', tokenSet);
    
    res.send(`
      <h1>Авторизация успешна!</h1>
      <p>Токены получены и сохранены.</p>
      <p><a href="/accounts">Получить список счетов</a></p>
      <p><a href="/">Вернуться на главную</a></p>
    `);
  } catch (error) {
    console.error('Ошибка при обработке callback:', error);
    res.status(500).send('Ошибка при получении токенов');
  }
});

app.get('/accounts', async (req, res) => {
  try {
    // Проверяем, есть ли активные токены
    if (!xero.tenants || xero.tenants.length === 0) {
      return res.status(401).send('Сначала авторизуйтесь через /connect');
    }

    const response = await xero.accountingApi.getAccounts(xero.tenants[0].tenantId);
    res.json({
      tenant: xero.tenants[0],
      accounts: response.body.accounts
    });
  } catch (error) {
    console.error('Ошибка при получении счетов:', error);
    res.status(500).send('Ошибка при получении счетов из Xero API');
  }
});

app.get('/status', (req, res) => {
  const status = {
    connected: xero.tenants && xero.tenants.length > 0,
    tenants: xero.tenants || [],
    hasTokens: !!xero.readTokenSet()
  };
  
  res.json(status);
});

app.listen(port, () => {
  console.log(`🚀 Xero SDK Test Server запущен на http://localhost:${port}`);
  console.log(`🔗 Перейди на http://localhost:${port}/connect для авторизации`);
  console.log('Конфигурация Xero Client:');
  console.log('- Client ID:', process.env.CLIENT_ID);
  console.log('- Redirect URI:', `http://localhost:${port}/callback`);
  console.log('- Scopes:', 'openid profile email accounting.settings accounting.transactions offline_access');
});