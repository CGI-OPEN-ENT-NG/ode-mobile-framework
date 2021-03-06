import {
    actionTypeActivationContext, IActivationContext, IActivationContextFetchedAction, IActivationUserInfo, IActivationContextRequestedAction, IActivationModel, actionTypeActivationSubmit, IActivationSubmitRequestedAction, IActivationSubmitErrorAction
} from "../actions/activation";

// TYPE DEFINITIONS -------------------------------------------------------------------------------
export enum SubmitState {
    Void, Loading, Failed, Success
}
export enum ContextState {
    Void, Loading, Failed, Success
}
export interface IActivationState {
    isActivating: boolean
    context: IActivationContext
    userinfo: IActivationUserInfo
    submitted: IActivationModel,
    submitState: SubmitState
    contextState: ContextState,
    submitError: string
}

// THE REDUCER ------------------------------------------------------------------------------------

export const stateDefault: IActivationState = {
    isActivating: false,
    context: {
        cgu: true,
        passwordRegex: "",
        mandatory: { mail: false, phone: false }
    },
    submitted: {
        phone: "",
        login: "",
        activationCode: "",
        confirm: "",
        email: "",
        password: ""
    },
    userinfo: { activationCode: "", login: "" },
    contextState: ContextState.Void,
    submitState: SubmitState.Void,
    submitError: ""
};

const activationReducer = (state: IActivationState = stateDefault, action): IActivationState => {
    switch (action.type) {
        case actionTypeActivationContext.requested:
            return {
                ...state,
                userinfo: (action as IActivationContextRequestedAction).userinfo,
                contextState: ContextState.Loading
            };
        case actionTypeActivationContext.received:
            return {
                ...state,
                context: (action as IActivationContextFetchedAction).context,
                contextState: ContextState.Success,
                isActivating: true
            };
        case actionTypeActivationContext.fetchError:
            return {
                ...state,
                submitError: (action as IActivationSubmitErrorAction).message,
                contextState: ContextState.Failed
            };
        case actionTypeActivationSubmit.requested:
            return {
                ...state,
                submitted: (action as IActivationSubmitRequestedAction).model,
                submitState: SubmitState.Loading
            };
        case actionTypeActivationSubmit.received:
            return {
                ...state,
                isActivating: false,
                submitState: SubmitState.Success
            };
        case actionTypeActivationSubmit.fetchError:
            return {
                ...state,
                submitError: (action as IActivationSubmitErrorAction).message || "",
                submitState: SubmitState.Failed
            };
        default:
            return state;
    }
};
export default activationReducer;
