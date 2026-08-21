import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("audit", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const env = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const context = {
  waitUntil() {},
  passThroughOnException() {},
};

async function render(path) {
  const response = await worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    env,
    context,
  );
  return { response, html: await response.text() };
}

test("all public routes render successfully", async () => {
  const routes = [
    "/",
    "/about",
    "/our-work",
    "/our-work/pathways-to-home",
    "/our-work/bridge-to-stability",
    "/campus",
    "/impact",
    "/ways-to-give",
    "/donate",
    "/major-gifts",
    "/daf-endowment",
    "/partner",
    "/stories",
    "/contact",
    "/privacy",
    "/terms",
  ];

  for (const route of routes) {
    const { response, html } = await render(route);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, route);
    assert.match(html, /United Social Services Inc\. \(USS\)/, route);
  }
});

test("client-approved campaign, mission, vision, values and motto are present", async () => {
  const home = await render("/");
  assert.match(home.html, /USS is building the resources to serve today/);
  assert.match(home.html, /SUPPORT USS TODAY/);
  assert.match(home.html, /HELP BUILD THE FUTURE/);
  assert.match(home.html, /Current Funding Priorities/);
  assert.match(home.html, /10,000 PEOPLE\. \$100 EACH\. \$1 MILLION\./);
  assert.match(home.html, /\$4,000,000/);
  assert.match(home.html, /Campaign launching/);
  assert.doesNotMatch(home.html, /\$0\.0M/);

  const about = await render("/about");
  assert.match(about.html, /Our Mission/);
  assert.match(about.html, /Our Vision/);
  assert.match(about.html, /Accountability/);
  assert.match(about.html, /Community Empowerment/);
  assert.match(about.html, /Mr\. Lee C\. Wallace/);

  const work = await render("/our-work");
  assert.match(work.html, /Immediate protection and compassionate care/);
  assert.match(work.html, /Essential services and personalized guidance/);
  assert.match(work.html, /Developing pathways toward long-term housing, independence and opportunity/);
});

test("approved giving, needed-item, social and inquiry destinations are rendered", async () => {
  const giving = await render("/ways-to-give");
  assert.match(giving.html, /donate-to-change-lives-21399/);
  assert.match(giving.html, /https:\/\/a\.co\/05wOLDTv/);
  assert.match(giving.html, /united-social-services-inc-uss-donor-advised-fund-daf/);
  assert.match(giving.html, /uss-endowment-and-legacy-fund-contribution/);
  assert.doesNotMatch(giving.html, /registry\/ER\//i);
  const obsoleteRegistryId = ["94a3472e", "79ab", "4ac6", "b280", "8d71081cf2f4"].join("-");
  assert.equal(giving.html.includes(obsoleteRegistryId), false);

  const contact = await render("/contact");
  assert.match(contact.html, /lwallace@usstx\.org/);
  assert.match(contact.html, /\(210\) 245-8780/);
  assert.match(contact.html, /3918 Clark Ave/);
  assert.match(contact.html, /facebook\.com\/share\/14kc5Xw6Lz8/);
  assert.match(contact.html, /instagram\.com\/uss_tx/);

  const home = await render("/");
  assert.match(home.html, /facebook\.com\/share\/14kc5Xw6Lz8/);
  assert.match(home.html, /instagram\.com\/uss_tx/);
  assert.match(home.html, /82-5444257/);
});

test("DAF, future-language, founder and campaign revisions are present", async () => {
  const daf = await render("/daf-endowment");
  assert.match(daf.html, /Sustaining Stability\. Advancing Dignity\. Building the Future\./);
  assert.match(daf.html, /Why USS-Managed Giving Matters/);
  assert.match(daf.html, /Legal &amp; Transparency Statement/);

  const about = await render("/about");
  assert.match(about.html, /provides essential services and direct community support/);
  assert.match(about.html, /linkedin\.com\/in\/lee-c-wallace/);
  assert.doesNotMatch(about.html, /provides housing, essential services/i);

  const pathways = await render("/our-work/pathways-to-home");
  assert.match(pathways.html, /currently in the development and fundraising stage/);

  const bridge = await render("/our-work/bridge-to-stability");
  assert.match(bridge.html, /services USS currently supports as well as organizational capacity/);

  const donate = await render("/donate");
  assert.match(donate.html, /10,000 PEOPLE\. \$100 EACH\. \$1 MILLION\./);
  assert.match(donate.html, /Invite Someone Else/);
});

test("donation routing source preserves exact current and future designations", async () => {
  const source = await readFile(new URL("../app/site.tsx", import.meta.url), "utf8");
  assert.match(source, /today: \{ title: "Fund USS Today", subtitle: "Current Needs \/ Where Most Needed Today"/);
  assert.match(source, /future: \{ title: "Build USS Tomorrow", subtitle: "Future Needs"/);
  assert.match(source, /Campus, Housing & Future Infrastructure/);
  const removedDonorTitle = ["Strengthen", "USS"].join(" ");
  const removedFundQuery = ["fund", "strengthen"].join("=");
  assert.equal(source.includes(removedDonorTitle), false);
  assert.equal(source.includes(removedFundQuery), false);
  assert.match(source, /src="\/uss-primary-logo\.svg"/);
  assert.doesNotMatch(source, /fund=campus|fund=serve-today/);
  assert.doesNotMatch(source, /registry\/ER\//i);
});
