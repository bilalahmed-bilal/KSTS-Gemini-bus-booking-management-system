import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.AUTH_SECRET;

if (!secretKey) {
  throw new Error("AUTH_SECRET is missing");
}

const encodedKey = new TextEncoder().encode(secretKey);


export async function createSession(payload: {
  id: string;
  email: string;
  role: string;
  name: string;
}) {

  return await new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

}



export async function verifySession(token: string) {

  try {

    const { payload } = await jwtVerify(
      token,
      encodedKey,
      {
        algorithms: ["HS256"],
      }
    );

    return payload;

  } catch {

    return null;

  }

}