import type { NextApiRequest, NextApiResponse } from 'next';
import { imagekit } from "@faris/utils/imageKit";

export default  function handler(req:NextApiRequest,res:NextApiResponse){
  try {
    const result = imagekit.getAuthenticationParameters();
    res.json(result)
  } catch (error) {
    console.error(error);
    res.json({ error: 'Imagekit had an error' });
  }
}
