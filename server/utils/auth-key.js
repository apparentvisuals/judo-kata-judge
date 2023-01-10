import { nanoid } from 'nanoid';

let auth = nanoid();
console.log(auth);
setTimeout(() => {
  auth = nanoid();
  console.log(auth);
}, 48 * 60 * 60 * 1000);

export function getAuth() {
  return auth.substring();
}
