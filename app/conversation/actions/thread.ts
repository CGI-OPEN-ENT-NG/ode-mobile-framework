import { Conf } from "../../Conf";
import { Tracking } from "../../tracking/TrackingManager";
import { read } from "../../infra/Cache";

export const fetchThread = dispatch => async (threadId: string) => {
	try{
		const messages = await read(`/conversation/thread/messages/${threadId}`);

		for(let message of messages){
			if(!message.unread){
				continue;
			}
			
			message.unread = false;
			fetch(`${Conf.platform}/conversation/message/${message.id}`);
		}

		Tracking.logEvent('refreshConversation', {
			application: 'conversation'
		});

		dispatch({
			type: 'FETCH_THREAD_CONVERSATION',
			messages: messages,
			threadId: threadId
		});
	}
	catch(e){
		console.log(e);
	}
}

export const readThread = dispatch => async (threadId: string) => {
	try{
		const messages = await read(`/conversation/thread/messages/${threadId}`);

		for(let message of messages){
			if(!message.unread){
				continue;
			}
			message.unread = false;
			fetch(`${Conf.platform}/conversation/message/${message.id}`);
		}

		Tracking.logEvent('readConversation', {
			application: 'conversation'
		});

		dispatch({
			type: 'READ_THREAD_CONVERSATION',
			messages: messages,
			threadId: threadId
		});
	}
	catch(e){
		console.log(e);
	}
}