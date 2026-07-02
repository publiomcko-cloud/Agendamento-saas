import { describe, expect, it } from "vitest";
import { classNames, formatCurrency, formatRoleLabel } from "./utils";

describe("utils", () => {
  it("formats known roles with portuguese labels", () => {
    expect(formatRoleLabel("admin")).toBe("Administrador");
    expect(formatRoleLabel("attendant")).toBe("Atendente");
    expect(formatRoleLabel("client")).toBe("Cliente");
  });

  it("keeps unknown roles untouched", () => {
    expect(formatRoleLabel("owner")).toBe("owner");
  });

  it("joins truthy class names only", () => {
    expect(classNames("base", false, null, "accent", undefined)).toBe(
      "base accent",
    );
  });

  it("formats values as BRL currency", () => {
    expect(formatCurrency("149.9")).toBe("R$\u00a0149,90");
  });
});
