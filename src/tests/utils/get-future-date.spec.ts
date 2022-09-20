import { expect, test } from "vitest";
import { getFuruteDate } from "./get-future-date";

test("increases date with one year", () => {
    const year = new Date().getFullYear();

    expect(getFuruteDate(`${year}-08-10`).getFullYear())
        .toEqual(2023);
});