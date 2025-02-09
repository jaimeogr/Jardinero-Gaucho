import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const { OAuth2Client } = require('google-auth-library');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const app = express();

// Add JSON parsing middleware
app.use(express.json());

const PORT = process.env.PORT || 3000;

// props: {"name": "validate-google-jwt", "title": "Validate Google JWT"}
const client = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);

async function validateGoogleToken(token: any) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_WEB_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
  });
  const payload = ticket.getPayload();
  return payload; // This contains user information
}

// Express route example
app.post('/auth/google', async (req, res) => {
  const { token } = req.body; // Get the token from the request body
  try {
    const userData = await validateGoogleToken(token);
    // Here you can create or update the user in Supabase
    res.status(200).json(userData);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

app.post('/auth/supabase', async (req, res) => {
  const { token } = req.body;
  try {
    const userData = await validateGoogleToken(token);

    // I should probably use: https://supabase.com/docs/reference/javascript/auth-signinwithidtoken
    // const { data, error } = await supabase.auth.signInWithIdToken({
    //   provider: 'google',
    //   token: 'your-id-token'
    // })

    // Check if user exists in Supabase
    const { data: user, error } = await supabase.from('users').upsert({
      user_id: userData.sub, // Use Google user ID as the primary key
      email: userData.email,
      first_name: userData.given_name,
      last_name: userData.family_name,
    });

    if (error) {
      console.error('Supabase upsert error:', error);
      throw error;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Invalid token or error upserting user:', error);
    res.status(401).json({ error: 'Invalid token or error upserting user' });
  }
});
