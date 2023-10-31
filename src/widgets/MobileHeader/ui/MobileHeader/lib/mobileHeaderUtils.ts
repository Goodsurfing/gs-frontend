export type ButtonNav = "OFFERS" | "COMMUNITY" | "ABOUT";

type Action = { type: ButtonNav };

interface DropdownState {
    isCommunityOpened: boolean;
    isAboutProjectOpened: boolean;
    isOffersOpened: boolean;
}

export const initialState: DropdownState = {
    isCommunityOpened: false,
    isAboutProjectOpened: false,
    isOffersOpened: false,
};

export const toggleDropdownReducer = (state: DropdownState, action: Action) => {
    switch (action.type) {
        case "COMMUNITY":
            return { ...state, isCommunityOpened: !state.isCommunityOpened };
        case "ABOUT":
            return {
                ...state,
                isAboutProjectOpened: !state.isAboutProjectOpened,
            };
        case "OFFERS":
            return { ...state, isOffersOpened: !state.isOffersOpened };
        default:
            return state;
    }
};
