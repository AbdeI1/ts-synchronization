import { Mutex } from "../src/mutex";

console.log("Without lock")
console.log("---------------------")

// function with race condition
let x = 0;
async function incCount() {
  let y = x++;
  await new Promise(r => setTimeout(r, Math.random()*1000));
  console.log(y);
}

// numbers will not be printed in order
// behaviour might change beween runs
let t: Promise<void>[] = [];
for (let i = 0; i < 20; i++) {
  t.push(incCount());
  await new Promise(r => setTimeout(r, Math.random()*200));
}
for (let i = 0; i < t.length; i++)
  await t[i];

console.log();
await new Promise(r => setTimeout(r, 1000));
console.log("With lock")
console.log("---------------------")

// this can be solved with a lock
x = 0;
let lock = new Mutex();
async function incCountLocked() {

  // lock the lock
  await lock.lock();

  // no other thread can pass the lock statement
  // until this thread reaches the unlock statement
  let y = x++;
  await new Promise(r => setTimeout(r, Math.random()*1000));
  console.log(y);

  // unlock the lock
  lock.unlock();
}

// numbers will now be printed in expected order
t = [];
for (let i = 0; i < 20; i++) {
  t.push(incCountLocked());
  await new Promise(r => setTimeout(r, Math.random()*200));
}
for (let i = 0; i < t.length; i++)
  await t[i];
