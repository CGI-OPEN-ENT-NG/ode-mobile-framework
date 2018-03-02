import I18n from "react-native-i18n";
import { fillUserData } from './auth';
import { Conf } from "../Conf";
import { adaptator } from "../infra/HTMLAdaptator";
import { Me } from "../infra/Me";
import { AsyncStorage } from "react-native";

console.log(Conf)

let loadingState = 'idle';
let awaiters = [];
let schoolbooks = [];
const loadSchoolbooks = (): Promise<Array<any>> => {
	return new Promise(async (resolve, reject) => {
		if(loadingState === 'over'){
			resolve(schoolbooks);
			return;
		}
		if(loadingState === 'loading'){
			awaiters.push(() => resolve(schoolbooks));
			return;
		}
		loadingState = 'loading';
		awaiters.push(() => resolve(schoolbooks));
		for(let child of Me.session.children){
			const response = await fetch(`${ Conf.platform }/schoolbook/list/0/${child.id}`);
			const messages = await response.json();
			schoolbooks = [...schoolbooks, ...messages];
		}
		awaiters.forEach(a => a());
		loadingState = 'over';
	});
}

const dataTypes = {
	SCHOOLBOOK: async news => {
		let defaultContent = {
			date: news.date.$date,
			id: news._id,
			images: [],
			message: adaptator(news.message).toText(),
			resourceName: I18n.t("schoolbook-appTitle"),
			htmlContent: adaptator(news.message).adapt().toHTML(),
			senderId: news.sender,
			senderName: news.params.username,
			title: news.params.wordTitle
		};
		if(!news.params.resourceUri || news.params.resourceUri.indexOf('word') === -1){
			return defaultContent;
		}
		const schoolbooks = await loadSchoolbooks();
		const schoolbookId = news.params.resourceUri.split('word/')[1];
		const schoolbook = schoolbooks.find(s => s.id === parseInt(schoolbookId));
		if(schoolbook){
			return {
				date: news.date.$date,
				id: news._id,
				images: adaptator(schoolbook.text).toImagesArray(),
				message: adaptator(schoolbook.text).toText(),
				resourceName: I18n.t("schoolbook-appTitle"),
				htmlContent: adaptator(schoolbook.text).adapt().toHTML(),
				senderId: news.sender,
				senderName: news.params.username,
				title: schoolbook.title
			}
		}
		return defaultContent;
	},
	NEWS: async news => {
		const newsData = {
			date: news.date.$date,
			id: news._id,
			images: [],
			message: adaptator(news.message).toText(),
			resourceName: news.params.resourceName,
			htmlContent: adaptator(news.message).adapt().toHTML(),
			senderId: news.sender,
			senderName: news.params.username,
			title: news.params.resourceName
		}
		if (news.params.resourceUri.indexOf('/info') === -1) {
			return newsData
		}

		const split = news.params.resourceUri.split('/');
		const infoId = split[split.length -1];
		const threadSplit = news.params.resourceUri.split('thread/');
		const threadId = parseInt(threadSplit[threadSplit.length - 1]);
		try {

			const response = await fetch(`${Conf.platform}/actualites/thread/${threadId}/info/${infoId}`)
			const data = await response.json()

			return {
				date: news.date.$date,
				id: data._id,
				images: adaptator(data.content).toImagesArray(),
				message: adaptator(data.content).toText(),
				resourceName: data.thread_title,
				senderId: news.sender,
				senderName: news.params.username,
				title: data.title
			}
		} catch (e) {
			//resource has been deleted
			return newsData
		}
	},
	BLOG: async news => {
		const newsData = {
			date: news.date.$date,
			id: news._id,
			images: [],
			message: adaptator(news.message).toText(),
			resourceName: news.params.blogTitle,
			senderId: news.sender,
			senderName: news.params.username,
			title: news.params.blogTitle
		}

		if (!news["sub-resource"]) {
			return newsData
		}

		try {
			const response = await fetch(`${Conf.platform}/blog/post/${news.resource}/${news["sub-resource"]}`)
			const data = await response.json()

			let message = adaptator(data.content).toText()

			return {
				date: data.modified.$date,
				id: data._id,
				images: adaptator(data.content).toImagesArray(),
				message,
				resourceName: news.params.blogTitle,
				senderId: data.author.userId,
				senderName: data.author.username,
				title: data.title
			}
		} catch (e) {
			//fetching blog failed
			return newsData
		}
	},
}

const excludeTypes = ["BLOG_COMMENT", "BLOG_POST_SUBMIT", "BLOG_POST_PUBLISH", "NEWS-COMMENT"]

const writeTypesParams = (availableApps) => {
	let params = "";
	for(let app in availableApps){
		if(availableApps[app]){
			params += "&type=" + app;
		}
	}
	return params;
}

const fillData = async (results: any[]) => {
	const newResults = []
	for (let result of results) {
		let newResult = await dataTypes[result.type](result);
		newResult.application = result.type.toLowerCase();
		newResults.push(newResult);
	}

	return newResults
}

const storedFilters = async () => {
	const apps = await AsyncStorage.getItem('timeline-filters');
	if(!apps){
		return { "BLOG": true, "NEWS": true, "SCHOOLBOOK": true };
	}
	return JSON.parse(apps);
}
const storeFilters = async (availableApps) => await AsyncStorage.setItem('timeline-filters', JSON.stringify(availableApps));

export const pickFilters = dispatch => (selectedApps) => {
	dispatch({
		type: "PICK_FILTER_TIMELINE",
		selectedApps: selectedApps
	});
}

export const setFilters = dispatch => (availableApps) => {
	dispatch({
		type: "FILTER_TIMELINE",
		availableApps: availableApps
	});

	storeFilters(availableApps);
	listTimeline(dispatch)(0, availableApps);
}

export const clearTimeline = dispatch => () => {
	dispatch({
		type: "CLEAR_TIMELINE"
	});
}

export const listTimeline = dispatch => async (page, availableApps) => {
	dispatch({
		type: "FETCH_TIMELINE",
	})
	await fillUserData();
	
	if(!availableApps){
		availableApps = await storedFilters();
		dispatch({
			type: "FILTER_TIMELINE",
			availableApps: availableApps
		});

		dispatch({
			type: "PICK_FILTER_TIMELINE",
			selectedApps: availableApps
		});
	}
	const response = await fetch(`${Conf.platform}/timeline/lastNotifications?page=${page}&${writeTypesParams(availableApps)}`)

	try {
		const news = await response.json()
		let results = news.results.filter(n => excludeTypes.indexOf(n["event-type"]) === -1 && n.params);
		const newNews = await fillData(results)

		dispatch({
			type: "APPEND_TIMELINE",
			news: newNews,
		})
	} catch (e) {
		console.log(e)
		dispatch({
			type: "END_REACHED_TIMELINE",
		})
	}
}
