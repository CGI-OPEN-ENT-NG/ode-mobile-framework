import { PATH_CONVERSATION, matchs } from '../constants/paths'
import {READ_SUCCESS} from '../constants/docs'
import { Mix } from 'entcore-toolkit';
import { Thread } from './Thread';


const initialState = {
    threads: [],
    page: 0,
    lastPage: false,
    synced: true,
}


export function Conversation(state = initialState, action) {

    if (matchs([PATH_CONVERSATION], action.path) && action.type === READ_SUCCESS ) {
        const data = action.payload;
        const newState = {...state};

        newState.page = action.id;
        newState.lastPage = data.length ===0;
        newState.synced = true;

        if (action.id === 0)
            newState.threads = Mix.castArrayAs(Thread, data.filter(thread => !thread.parent_id))
        else
            newState.threads = [ ...state.threads, ...Mix.castArrayAs(Thread, data.filter(thread => !thread.parent_id))];

        for(let i = 0; i < data.length; i++){
            if(data[i].parent_id){
                let thread = newState.threads.find(t => t.id === data[i].parent_id);
                if(thread){
                    thread.addMail(data[i]);
                }
            }
        }

        return newState;
    }
    return state;
}
