
export interface ConversationModel {
	id: string,
    subject: string
    body: string
	date: number
	displayNames: string[][]
	nb: number
}

const initialState = {
	payload: [
        {
            "id": "46c7bc61-b9dd-4c25-b164-fd6252236603",
            "parent_id": null,
            "subject": "tst",
            "body": "<br><br><div class=\"signature new-signature\">toto tata<br>rue dSSD</div>",
            "from": "aa34467e-e188-4c70-a238-48c02b72179a",
            "fromName": null,
            "to": [
                "78378bb3-404a-4bc7-aff6-03ae685ec623"
            ],
            "toName": null,
            "cc": [],
            "ccName": null,
            "displayNames": [
                [
                    "aa34467e-e188-4c70-a238-48c02b72179a",
                    "Cindy ONG"
                ],
            ],
            "date": 1515496482666,
            "unread": false,
            "conversation": null,
            "nb": 1
        },
        {
            "id": "63d9d9a3-de67-44c7-8f56-befecb9344da",
            "parent_id": null,
            "subject": "TEST ENVOI GROUPE CE2",
            "body": "",
            "from": "aa34467e-e188-4c70-a238-48c02b72179a",
            "fromName": null,
            "to": [
                "694-1479825331713"
            ],
            "toName": null,
            "cc": [],
            "ccName": null,
            "displayNames": [
                [
                    "aa34467e-e188-4c70-a238-48c02b72179a",
                    "Cindy ONG"
                ],
                [
                    "f825df70-3c85-4a95-8d3e-6b7035fec059",
                    "Tous les Ã©lÃ¨ves du groupe CE2."
                ]
            ],
            "date": 1515496282666,
            "unread": false,
            "conversation": "63d9d9a3-de67-44c7-8f56-befecb9344da",
            "nb": 2
        },
        {
            "id": "63d9d9a3-de67-44c7-8f56-befecb9344da",
            "parent_id": null,
            "subject": "Nouvelle conversation",
            "body": "",
            "from": "78378bb3-404a-4bc7-aff6-03ae685ec623",
            "fromName": null,
            "to": [
                "694-1479825331713"
            ],
            "toName": null,
            "cc": [],
            "ccName": null,
            "displayNames": [
                [
                    "aa34467e-e188-4c70-a238-48c02b72179a",
                    "Cindy ONG"
                ],
                [
                    "cc8ba9e5-63e1-4e21-9a74-8cb914c1f737",
                    "Tous les Ã©lÃ¨ves du groupe CM2."
                ],
                [
                    "f825df70-3c85-4a95-8d3e-6b7035fec059",
                    "Ana CAVEL"
                ]
            ],
            "date": 1514380370906,
            "unread": false,
            "conversation": "63d9d9a3-de67-44c7-8f56-befecb9344da",
            "nb": 2
        },
        {
            "id": "46c7bc61-b9dd-4c25-b164-fd6252236603",
            "parent_id": null,
            "subject": "tst",
            "body": "<br><br><div class=\"signature new-signature\">toto tata<br>rue dSSD</div>",
            "from": "aa34467e-e188-4c70-a238-48c02b72179a",
            "fromName": null,
            "to": [
                "78378bb3-404a-4bc7-aff6-03ae685ec623"
            ],
            "toName": null,
            "cc": [],
            "ccName": null,
            "displayNames": [
                [
                    "aa34467e-e188-4c70-a238-48c02b72179a",
                    "Cindy ONG"
                ],
                [
                    "f825df70-3c85-4a95-8d3e-6b7035fec059",
                    "Ana CAVEL"
                ],
                [
                    "f825df70-3c85-4a95-8d3e-6b7035fec059",
                    "Tous les Ã©lÃ¨ves du groupe CE2."
                ],
                [
                    "cc8ba9e5-63e1-4e21-9a74-8cb914c1f737",
                    "Tous les Ã©lÃ¨ves du groupe CM2."
                ],
            ],
            "date": 1515496482666,
            "unread": false,
            "conversation": null,
            "nb": 1
        },
        {
            "id": "46c7bc61-b9dd-4c25-b164-fd6252236603",
            "parent_id": null,
            "subject": "Tres long titre qui va etre tronqué à 30 caractères",
            "body": "<br><br><div class=\"signature new-signature\">Message tronqué à 40 caratères. La suite du message<br>rue dSSD</div>",
            "from": "aa34467e-e188-4c70-a238-48c02b72179a",
            "fromName": null,
            "to": [
                "78378bb3-404a-4bc7-aff6-03ae685ec623"
            ],
            "toName": null,
            "cc": [],
            "ccName": null,
            "displayNames": [
                [
                    "aa34467e-e188-4c70-a238-48c02b72179a",
                    "Cindy ONG"
                ],
                [
                    "f825df70-3c85-4a95-8d3e-6b7035fec059",
                    "Ana CAVEL"
                ],
                [
                    "f825df70-3c85-4a95-8d3e-6b7035fec059",
                    "Tous les Ã©lÃ¨ves du groupe CE2."
                ],
                [
                    "cc8ba9e5-63e1-4e21-9a74-8cb914c1f737",
                    "Tous les Ã©lÃ¨ves du groupe CM2."
                ],
                [
                    "f825df70-3c85-4a95-8d3e-6b7035fec059",
                    "Tous les Ã©lÃ¨ves du groupe CE2."
                ]
            ],
            "date": 1515496482666,
            "unread": false,
            "conversation": null,
            "nb": 1
        },
	],
    filter: null,
	synced: true,
}

export interface ConversationState {
	payload: Array<ConversationModel>
    filter: null,
	synced: boolean
}

export const conversations = (state: ConversationState = initialState, action) : ConversationState =>{
    if (action.type === "FILTER" && action.storeName === "conversations")
        return (action.value === null) ? { ...state, filter: undefined} : { ...state, filter: action.value}
	return state
}



