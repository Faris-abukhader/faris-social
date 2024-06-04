import { env } from "@faris/env.mjs";

type Authenticator = {
  signature: string;
  expire: number;
  token: string;
};

export const authenticator = async () => {
    console.log('hello from authenticator')
    console.log(`/api/imageKit`)
  try {

    const response = await fetch(`/api/imageKit`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await response.json();

    const { signature, expire, token } = data as Authenticator;

    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${JSON.stringify(error)}`);
  }
};




