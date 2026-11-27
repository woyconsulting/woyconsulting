const test = require("node:test");
const assert = require("node:assert/strict");
const { loadTs } = require("./helpers/load-ts.cjs");

const { mergePageCopy } = loadTs("lib/cms/page-copy.ts");
const data = loadTs("lib/recreation-content.ts");
const { defaultExpertisePage } = loadTs("lib/cms/expertise-page.ts", {
  "../recreation-content": data,
});
const { defaultApproachPage } = loadTs("lib/cms/approach-page.ts", {
  "../recreation-content": data,
  "../recreation-philosophy": loadTs("lib/recreation-philosophy.ts"),
});

test("the current copy remains available before the first publish or with an older snapshot", () => {
  for (const page of [defaultExpertisePage, defaultApproachPage]) {
    assert.deepEqual(mergePageCopy(page, null), page);
    assert.deepEqual(mergePageCopy(page, undefined), page);
  }
});

test("Expertise applies published service copy while preserving sections and destinations", () => {
  const page = mergePageCopy(defaultExpertisePage, {
    areas: {
      strategy: { services: ["  Business planning  ", "", false], caseSlug: "elsewhere" },
      extra: { title: "An unexpected section" },
    },
  });
  assert.deepEqual(page.areas.strategy.services, ["Business planning"]);
  assert.equal(page.areas.strategy.title, defaultExpertisePage.areas.strategy.title);
  assert.equal(page.areas.strategy.caseSlug, undefined);
  assert.deepEqual(Object.keys(page.areas), Object.keys(defaultExpertisePage.areas));
});

test("Approach accepts nested copy edits and falls back for invalid or blank values", () => {
  const page = mergePageCopy(defaultApproachPage, {
    intro: { heading: "A clearer path.", description: " " },
    philosophy: { compass: { title: "Direction for leaders", description: [] }, introduction: [""] },
  });
  assert.equal(page.intro.heading, "A clearer path.");
  assert.equal(page.intro.description, defaultApproachPage.intro.description);
  assert.equal(page.philosophy.compass.title, "Direction for leaders");
  assert.equal(page.philosophy.compass.description, defaultApproachPage.philosophy.compass.description);
  assert.deepEqual(page.philosophy.introduction, defaultApproachPage.philosophy.introduction);
});
