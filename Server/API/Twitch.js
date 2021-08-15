import axios from 'axios';

const { TWITCH_AUTH_TOKEN, TWITCH_CLIENT_ID } = process.env;
console.log(TWITCH_AUTH_TOKEN);

const ENDPOINT = 'https://api.twitch.tv/helix';

export async function getTwitchChannel(channelName) {
  const { data } = await axios.get(
    `${ENDPOINT}/streams?user_login=${channelName}`,
    {
      headers: {
        Authorization: `Bearer ${TWITCH_AUTH_TOKEN}`,
        ['Client-ID']: TWITCH_CLIENT_ID
      }
    }
  );

  return data;
}
