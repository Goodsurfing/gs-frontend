import {
    describe, it, expect, vi,
} from "vitest";
import { render } from "@testing-library/react";
import CommunityNewsContainer from "./CommunityNewsContainer";

/**
 * Чек-лист правок: "на главной не выводится новое из сообщества" — блок
 * запрашивал посты, отсортированные по лайкам (LikeBlogDesc), а не по
 * дате, из-за чего новый пост с 0 лайков никогда не всплывал выше старых
 * популярных.
 */

const getBlogList = vi.fn();

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/entities/Blog", () => ({
    useLazyGetBlogListQuery: () => [getBlogList, { data: undefined, isLoading: false }],
}));

describe("CommunityNewsContainer", () => {
    it("запрашивает посты, отсортированные по дате создания, а не по лайкам", () => {
        render(<CommunityNewsContainer />);

        expect(getBlogList).toHaveBeenCalledWith(
            expect.objectContaining({ sort: "created:desc" }),
        );
        expect(getBlogList).not.toHaveBeenCalledWith(
            expect.objectContaining({ sort: "likeBlog:desc" }),
        );
    });
});
