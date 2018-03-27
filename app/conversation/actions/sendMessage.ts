import { Conf } from "../../Conf";
import { Me } from "../../infra/Me";
import { Tracking } from "../../tracking/TrackingManager";
import { Message } from "../interfaces";

export const sendMessage = dispatch => async (data: Message) => {
	data.id = Math.random().toString();
	dispatch({
		type: "CONVERSATION_SEND",
		data: { 
			...data, 
			conversation: data.parentId, 
			from: Me.session.userId,
			date: Date.now()
		},
	})

	try {
		const response = await fetch(`${Conf.platform}/conversation/send?In-Reply-To=${data.parentId}`, {
			method: "post",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				body: data.body,
				to: data.to,
				cc: data.cc,
				subject: data.subject,
			}),
		})
		let json = await response.json();

		Tracking.logEvent('sentMessage', {
			application: 'conversation',
			length: data.body.length - 9
		});

		dispatch({
			type: "CONVERSATION_SENT",
			data: { 
				...data, 
				conversation: data.parentId, 
				from: Me.session.userId, 
				thread_id: data.thread_id,
				date: Date.now(),
				newId: json.id
			},
		});
	} catch (e) {
		console.log(e)
		dispatch({
			type: "CONVERSATION_FAILED_SEND",
			data: { 
				...data, 
				conversation: data.parentId, 
				from: Me.session.userId, 
				thread_id: data.thread_id ,
				date: Date.now()
			},
		})
	}
}