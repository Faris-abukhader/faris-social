import { getIronSession } from "iron-session";
import { sessionOptions } from "@faris/utils/session";
import redis from '@faris/server/redis'; // Import your Redis configuration here
import type { NextApiRequest,NextApiResponse } from 'next'
import { type UserSession } from "@faris/server/module/auth/auth.handler";


export default async  function handler(req:NextApiRequest,res:NextApiResponse){
  try {
    // Get the session ID from the request (you may need to adapt this based on your actual session setup)
    const ironSession = await getIronSession(req, res, sessionOptions);

    const sessionId = ironSession.user?.sessionId

    if(sessionId==undefined) return res.json({ error: 'Session ID not found' });

    // Get the session data from Redis
    let session = await redis.get(sessionId) as UserSession;

    // Parse the session data as needed (you can remove this if it's not necessary)
    session = JSON.parse(JSON.stringify(session)) as UserSession;

    // Return the session data as a JSON response
    res.json(session);
  } catch (error) {
    console.error(error);
    // NextResponse.status(500).json({ error: 'Internal server error' });
    res.json({ error: 'Internal server error' });
  }
}
