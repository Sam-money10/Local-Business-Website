// ============================================================
// quote-notify.js — Netlify Serverless Function
// Triggered when a quote form is submitted via Netlify Forms
// Sends an SMS to the owner via Twilio
// ============================================================
//
// Required environment variables (set in Netlify Dashboard):
//   TWILIO_ACCOUNT_SID  — From twilio.com console
//   TWILIO_AUTH_TOKEN   — From twilio.com console
//   TWILIO_FROM_NUMBER  — Your Twilio phone number (e.g. +15141234567)
//   OWNER_PHONE         — Your personal cell to receive texts (e.g. +15149876543)
// ============================================================

exports.handler = async (event) => {
  // Netlify Forms sends a POST with the form data when a submission happens
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parse the form submission payload from Netlify
    const payload = JSON.parse(event.body);
    const data = payload.payload?.data || {};

    const nom        = data.nom        || '(non fourni)';
    const telephone  = data.telephone  || '(non fourni)';
    const courriel   = data.courriel   || '(non fourni)';
    const adresse    = data.adresse    || '(non fourni)';
    const service    = data.service    || '(non fourni)';
    const date       = data.date       || '(non précisée)';
    const notes      = data.notes      || '(aucune)';

    // Build the SMS message
    const message = [
      '🏠 NOUVELLE SOUMISSION — Entretien Extérieur Élite',
      '',
      `👤 Nom: ${nom}`,
      `📱 Tél: ${telephone}`,
      `✉️  Courriel: ${courriel}`,
      `📍 Adresse: ${adresse}`,
      `🔧 Service: ${service}`,
      `📅 Date souhaitée: ${date}`,
      `💬 Notes: ${notes}`,
    ].join('\n');

    // Send SMS via Twilio REST API
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken  = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;
    const toNumber   = process.env.OWNER_PHONE;

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: fromNumber,
        To:   toNumber,
        Body: message,
      }).toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twilio error:', errorText);
      return { statusCode: 500, body: 'Erreur lors de l\'envoi du SMS' };
    }

    return { statusCode: 200, body: 'SMS envoyé avec succès' };

  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: 'Erreur interne' };
  }
};
