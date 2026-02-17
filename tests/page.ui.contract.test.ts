import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import Page from "@/app/page";
import { REGION_OPTIONS } from "@/app/scopeState";

describe("page ui contract", () => {
  it("renders strict output block isolated from non-strict hint text", () => {
    const html = renderToStaticMarkup(createElement(Page));

    expect(html).toContain("Economic Calendar");
    expect(html).toContain("Strict Output");
    expect(html).toContain('aria-label="Strict output block"');
    expect(html).toContain("Noch kein Output generiert.");

    const preMatch = html.match(/<pre[^>]*class="strict-output"[^>]*>([\s\S]*?)<\/pre>/);
    expect(preMatch).not.toBeNull();
    expect(preMatch?.[1] ?? "").toBe("");
  });

  it("keeps meta/debug state outside strict output before first generation", () => {
    const html = renderToStaticMarkup(createElement(Page));

    expect(html).not.toContain("<strong>Mode:</strong>");
    expect(html).not.toContain("<strong>Quellen:</strong>");

    const preMatch = html.match(/<pre[^>]*class="strict-output"[^>]*>([\s\S]*?)<\/pre>/);
    expect(preMatch).not.toBeNull();
    const preContent = preMatch?.[1] ?? "";
    expect(preContent).not.toContain("Mode:");
    expect(preContent).not.toContain("Quellen:");
    expect(preContent).not.toContain("sourceMode");
    expect(preContent).not.toContain("sourcesUsed");
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
});
