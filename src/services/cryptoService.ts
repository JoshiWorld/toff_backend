import crypto from "crypto";

function encrypt(text: string): string {
  const cipher = crypto.createCipher("aes-256-cbc", process.env.CYPHER_KEY!);
  let crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}

function decrypt(text: string): string {
  const decipher = crypto.createDecipher(
    "aes-256-cbc",
    process.env.CYPHER_KEY!
  );
  let dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

export { encrypt, decrypt };
