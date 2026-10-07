import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MembershipBadge } from "./MembershipBadge";

/**
 * GS-28: текст значка зависит от роли — волонтёр/организатор.
 */
describe("MembershipBadge", () => {
    it("показывает «Член сообщества» для волонтёра", () => {
        render(<MembershipBadge variant="volunteer" />);

        expect(screen.getByText("membershipBadge.Член сообщества")).toBeInTheDocument();
    });

    it("показывает «Партнёр Гудсёрфинга» для организатора", () => {
        render(<MembershipBadge variant="host" />);

        expect(screen.getByText("membershipBadge.Партнёр Гудсёрфинга")).toBeInTheDocument();
    });
});
