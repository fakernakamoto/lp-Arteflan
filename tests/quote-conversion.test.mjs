import { test } from "node:test";
import assert from "node:assert/strict";
import { reportQuoteConversion } from "../src/lib/quote-conversion.ts";

function setup(t, gtag) {
  const previous = globalThis.window;
  t.mock.timers.enable({ apis: ["setTimeout"] });
  globalThis.window = {
    gtag,
    setTimeout: (...args) => setTimeout(...args),
    clearTimeout: (...args) => clearTimeout(...args),
  };
  t.after(() => {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
    t.mock.timers.reset();
  });
}

test("sends the exact quote conversion and waits for the tag callback", async (t) => {
  const calls = [];
  setup(t, (...args) => calls.push(args));
  let finished = false;
  const pending = reportQuoteConversion().then(() => {
    finished = true;
  });
  await Promise.resolve();
  assert.equal(calls.length, 1);
  const [command, event, params] = calls[0];
  assert.equal(command, "event");
  assert.equal(event, "conversion");
  assert.equal(params.send_to, "AW-10900216944/WNpCCJzLsIgdEPC40M0o");
  assert.equal(params.event_timeout, 300);
  assert.deepEqual(Object.keys(params).sort(), ["event_callback", "event_timeout", "send_to"]);
  assert.equal(finished, false);
  params.event_callback();
  await pending;
  assert.equal(finished, true);
});

test("continues after 300ms if Google is blocked or never calls back", async (t) => {
  let callback;
  setup(t, (_command, _event, params) => {
    callback = params.event_callback;
  });
  let finished = 0;
  const pending = reportQuoteConversion().then(() => {
    finished++;
  });
  t.mock.timers.tick(299);
  await Promise.resolve();
  assert.equal(finished, 0);
  t.mock.timers.tick(1);
  await pending;
  assert.equal(finished, 1);
  callback();
  await Promise.resolve();
  assert.equal(finished, 1);
});

test("does not block the lead if gtag is unavailable", async (t) => {
  setup(t, undefined);
  const pending = reportQuoteConversion();
  t.mock.timers.tick(300);
  await pending;
});

test("does not block the lead if a third-party tag throws", async (t) => {
  setup(t, () => {
    throw new Error("Tracking unavailable");
  });
  const pending = reportQuoteConversion();
  t.mock.timers.tick(300);
  await pending;
});

test("can be called during SSR without accessing window", async () => {
  await reportQuoteConversion();
});
