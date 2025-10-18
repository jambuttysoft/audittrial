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
    <p>Server is running on port ${port}</p>
    <p><a href="/connect">Connect to Xero</a></p>
    <p><a href="/status">Check connection status</a></p>
  `);
});

app.get('/connect', async (req, res) => {
  try {
    const consentUrl = await xero.buildConsentUrl();
    console.log('Consent URL:', consentUrl);
    res.redirect(consentUrl);
  } catch (error) {
    console.error('Error creating consent URL:', error);
    res.status(500).send('Error creating authorization link');
  }
});

app.get('/callback', async (req, res) => {
  try {
    const tokenSet = await xero.apiCallback(req.url);
    console.log('Token set received:', tokenSet);
    
    res.send(`
      <h1>Authorization successful!</h1>
      <p>Tokens received and saved.</p>
      <p><a href="/accounts">Get list of accounts</a></p>
      <p><a href="/">Return to home</a></p>
    `);
  } catch (error) {
    console.error('Error processing callback:', error);
    res.status(500).send('Error retrieving tokens');
  }
});

app.get('/accounts', async (req, res) => {
  try {
    // Check if there are active tokens
    if (!xero.tenants || xero.tenants.length === 0) {
      return res.status(401).send('Please authorize via /connect first');
    }

    const response = await xero.accountingApi.getAccounts(xero.tenants[0].tenantId);
    res.json({
      tenant: xero.tenants[0],
      accounts: response.body.accounts
    });
  } catch (error) {
    console.error('Error retrieving accounts:', error);
    res.status(500).send('Error retrieving accounts from Xero API');
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
  console.log(`🚀 Xero SDK Test Server started at http://localhost:${port}`);
  console.log(`🔗 Go to http://localhost:${port}/connect to authorize`);
  console.log('Xero Client configuration:');
  console.log('- Client ID:', process.env.CLIENT_ID);
  console.log('- Redirect URI:', `http://localhost:${port}/callback`);
  console.log('- Scopes:', 'openid profile email accounting.settings accounting.transactions offline_access');
});