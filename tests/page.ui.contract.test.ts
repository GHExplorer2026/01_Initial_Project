import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import Page from "@/app/page";
import { REGION_OPTIONS } from "@/app/scopeState";

describe("page ui contract", () => {
  it("keeps strict output hidden by default until toggle is enabled", () => {
    const html = renderToStaticMarkup(createElement(Page));

    expect(html).toContain("Economic Calendar");
    expect(html).toContain("Strict Output");
    expect(html).toContain("Strict Output anzeigen");
    expect(html).toContain("Strict Output ist ausgeblendet.");
    expect(html).not.toContain('aria-label="Strict output block"');
  });

  it("keeps meta/debug state outside strict output before first generation", () => {
    const html = renderToStaticMarkup(createElement(Page));

    expect(html).not.toContain("<strong>Mode:</strong>");
    expect(html).not.toContain("<strong>Quellen:</strong>");

    expect(html).not.toContain('aria-label="Strict output block"');
  });

  it("renders scope controls with accessible fieldset and deterministic region ids", () => {
    const html = renderToStaticMarkup(createElement(Page));

    expect(html).toContain("<fieldset>");
    expect(html).toContain('<legend class="sr-only">Region selection</legend>');
    expect(html).toContain(">Alle<");
    expect(html).toContain(">Keine<");

    for (const option of REGION_OPTIONS) {
      const id = `region-${option.code.toLowerCase()}`;
      expect(html).toContain(`id="${id}"`);
      expect(html).toContain(`for="${id}"`);
      expect(html).toContain(option.label);
    }
  });

  it("renders ICS export filter controls for high and medium importance", () => {
    const html = renderToStaticMarkup(createElement(Page));

    expect(html).toContain("TOP-EVENT / 3 Sterne");
    expect(html).toContain("2 Sterne");
    expect(html).toContain('id="ics-filter-high"');
    expect(html).toContain('id="ics-filter-medium"');
  });
});
