const { Issuer, generators } = require('openid-client');

async function setupOIDC(app) {
  const issuer = await Issuer.discover('https://aai-dev.egi.eu/auth/realms/egi');  // Development environment
  const client = new issuer.Client({
    client_id: 'USE_YOUR_FEDERATION_REGISTRY_OD',
    client_secret: 'USE_YOUR_FEDERATION_REGISTRY_SECRET',
    redirect_uris: ['http://localhost:8081/callback'],
    response_types: ['code'],
  });


  app.get('/login', (req, res) => {
    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);
    const state = generators.state();

    req.session.code_verifier = code_verifier;
    req.session.state = state;

    const url = client.authorizationUrl({
      scope: 'openid profile email entitlements',
      code_challenge,
      code_challenge_method: 'S256',
    });

    res.redirect(url);
  });

  app.get('/callback', async (req, res) => {
    const params = client.callbackParams(req);
    const tokenSet = await client.callback('http://localhost:8081/callback', params, {
      code_verifier: req.session.code_verifier,
    });

    req.session.tokenSet = tokenSet;
    res.redirect('/profile');
  });

  app.get('/profile', async (req, res) => {
    if (!req.session.tokenSet) return res.redirect('/login');
    const userinfo = await client.userinfo(req.session.tokenSet.access_token);
    res.json(userinfo);
  });

 
  app.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
}

module.exports = { setupOIDC };