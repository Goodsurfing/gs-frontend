export type ButtonNav = "OFFERS" | "COMMUNITY" | "ABOUT" | "SUPPORT";

type Action = { type: ButtonNav };

interface DropdownState {
    isCommunityOpened: boolean;
    isAboutProjectOpened: boolean;
    isOffersOpened: boolean;
    isSupportOpened: boolean;
}

export const initialState: DropdownState = {
    isCommunityOpened: false,
    isAboutProjectOpened: false,
    isOffersOpened: false,
    isSupportOpened: false,
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
        case "SUPPORT":
            return { ...state, isSupportOpened: !state.isSupportOpened };
        case "OFFERS":
            return { ...state, isOffersOpened: !state.isOffersOpened };
        default:
            return state;
    }
};
