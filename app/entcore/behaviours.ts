import http from "axios"
import { infraPrefix } from "./globals"
import { model } from "./modelDefinitions"
import { Shareable } from "./rights"

export var Behaviours = (function() {
	return {
		storedRights: {} as any,
		sharingRights(): Promise<any> {
			return new Promise(resolve => {
				if (this.storedRights.json) {
					resolve(this.storedRights.json)
				}
				http.get("/" + infraPrefix + "/public/json/sharing-rights.json").then(config => {
					this.storedRights.json = config
					resolve(config)
				})
			})
		},
		appSharingRights(prefix: string): Promise<any> {
			return new Promise(resolve => {
				if (this.storedRights[prefix]) {
					resolve(this.storedRights[prefix])
				}
				http.get("/" + prefix + "/rights/sharing").then(config => {
					this.storedRights[prefix] = config
					resolve(config)
				})
			})
		},
		async copyRights(params: {
			provider: { resource: Shareable; application: string }
			target: { resources: Shareable[]; application: string }
		}): Promise<any> {
			if (!params.provider.resource.shared) {
				return
			}
			const config = await this.sharingRights()
			const providerSharing = await this.appSharingRights(params.provider.application)
			const targetSharing = await this.appSharingRights(params.target.application)

			params.provider.resource.shared.forEach(function(share) {
				if (share.userId === model.me.userId) {
					return
				}
				var data: any = {}
				if (share.groupId) {
					data.groupId = share.groupId
				} else {
					data.userId = share.userId
				}

				var bundles = {
					read: false,
					contrib: false,
					publish: false,
					comment: false,
					manager: false,
				}
				for (var property in share) {
					for (var bundle in providerSharing) {
						if (providerSharing[bundle].indexOf(property) !== -1) {
							var bundleSplit = bundle.split(".")
							bundles[bundleSplit[bundleSplit.length - 1]] = true
							config[bundleSplit[bundleSplit.length - 1]].requires.forEach(function(required) {
								bundles[required] = true
							})
						}
					}
				}

				function addRights() {
					data.actions = []
					for (var bundle in bundles) {
						if (!bundles[bundle]) {
							continue
						}
						for (var targetBundle in targetSharing) {
							var targetBundleSplit = targetBundle.split(".")
							if (targetBundleSplit[targetBundleSplit.length - 1].indexOf(bundle) !== -1) {
								targetSharing[targetBundle].forEach(function(right) {
									data.actions.push(right)
								})
							}
						}
					}

					//http().put('/' + params.target.application + '/share/json/' + targetResource, http().serialize(data)).e401(function(){});
				}

				//drop rights if I'm not part of the group
				if (model.me.groupsIds.indexOf(share.groupId) === -1) {
					params.target.resources.forEach(function(targetResource) {
						http.put("/" + params.target.application + "/share/remove/" + targetResource, data).then(function() {
							addRights()
						})
					})
				} else {
					//simply add rights bundles (don't want to remove my own manager right)
					params.target.resources.forEach(addRights)
				}
			})
		},
		register(application, appBehaviours) {
			this.applicationsBehaviours[application] = {}
			this.applicationsBehaviours[application] = appBehaviours
		},
		findRights(serviceName, resource): Promise<any> {
			const resolveRights = () => {
				const serviceBehaviours = Behaviours.applicationsBehaviours[serviceName]
				if (typeof serviceBehaviours.resource === "function") {
					console.log("resource method in behaviours is deprecated, please use rights object or rename to resourceRights")
					serviceBehaviours.resourceRights = serviceBehaviours.resource
				}

				if (typeof serviceBehaviours.resourceRights !== "function" && typeof serviceBehaviours.rights === "object") {
					var resourceRights = serviceBehaviours.rights.resource

					serviceBehaviours.resourceRights = function(element) {
						for (var behaviour in resourceRights) {
							if (
								model.me &&
								(model.me.hasRight(element, resourceRights[behaviour]) ||
									(element.owner && (model.me.userId === element.owner.userId || model.me.userId === element.owner)))
							) {
								element.myRights[behaviour] = resourceRights[behaviour]
							}
						}
					}
				}
				if (typeof serviceBehaviours.resourceRights === "function") {
					return serviceBehaviours.resourceRights(resource)
				} else {
					return {}
				}
			}

			return new Promise(resolve => {
				if (this.applicationsBehaviours[serviceName]) {
					if (!resource.myRights) {
						resource.myRights = {}
					}

					resolve(resolveRights())
					return
				}
				Behaviours.loadBehaviours(serviceName, () => {
					resolveRights()
				}).error(() => {
					resolveRights()
				})
			})
		},
		findBehaviours(serviceName, resource) {
			console.log("Deprecated, please use findRights")
			this.findRights(serviceName, resource)
		},
		loadBehaviours(serviceName, callback) {
			const err = { cb: undefined }
			const actions = {
				error(cb) {
					err.cb = cb
				},
			}

			if (this.applicationsBehaviours[serviceName]) {
				if (this.applicationsBehaviours[serviceName].callbacks) {
					this.applicationsBehaviours[serviceName].callbacks.push(callback)
					this.applicationsBehaviours[serviceName].errors.push(err)
					return actions
				}
				callback(this.applicationsBehaviours[serviceName])
				return actions
			} else {
				this.applicationsBehaviours[serviceName] = {
					callbacks: [callback],
					errors: [err],
				}
			}

			if (serviceName === ".") {
				return actions
			}

			const callbacks = Behaviours.applicationsBehaviours[serviceName].callbacks
			const errors = Behaviours.applicationsBehaviours[serviceName].errors
			http
				.get("/" + serviceName + "/public/js/behaviours.js")
				.then(() => {
					callbacks.forEach(cb => {
						cb(Behaviours.applicationsBehaviours[serviceName])
					})
				})
				.catch(() => {
					errors.forEach(err => {
						if (typeof err.cb === "function") {
							err.cb()
						}
					})
				})

			return actions
		},
		load(serviceName: string): Promise<any> {
			return new Promise((resolve, reject) => {
				Behaviours.loadBehaviours(serviceName, () => {
					resolve(this.applicationsBehaviours[serviceName])
				}).error(() => {
					reject()
				})
			})
		},
		findWorkflow(serviceName): Promise<any> {
			var returnWorkflows = function() {
				if (!this.applicationsBehaviours[serviceName]) {
					console.log("Behaviours from " + serviceName + " not found.")
					return {}
				}
				if (typeof this.applicationsBehaviours[serviceName].workflow === "function") {
					return this.applicationsBehaviours[serviceName].workflow()
				} else {
					if (
						typeof this.applicationsBehaviours[serviceName].rights === "object" &&
						this.applicationsBehaviours[serviceName].rights.workflow
					) {
						if (!this.applicationsBehaviours[serviceName].dependencies) {
							this.applicationsBehaviours[serviceName].dependencies = {}
						}
						return this.workflowsFrom(
							this.applicationsBehaviours[serviceName].rights.workflow,
							this.applicationsBehaviours[serviceName].dependencies.workflow
						)
					}
				}
			}.bind(this)

			if (this.applicationsBehaviours[serviceName] && !this.applicationsBehaviours[serviceName].callbacks) {
				return returnWorkflows()
			}

			return new Promise((resolve, reject) => {
				Behaviours.loadBehaviours(serviceName, () => {
					resolve(returnWorkflows())
				}).error(() => {
					reject()
				})
			})
		},
		workflowsFrom(obj, dependencies) {
			if (typeof obj !== "object") {
				console.log("Empty workflows")
				return {}
			}
			if (typeof dependencies !== "object") {
				dependencies = {}
			}
			var workflow = {}
			for (var prop in obj) {
				if (model.me.hasWorkflow(obj[prop])) {
					workflow[prop] = true
					if (typeof dependencies[prop] === "string") {
						workflow[prop] = workflow[prop] && model.me.hasWorkflow(dependencies[prop])
					}
				}
			}

			return workflow
		},
		applicationsBehaviours: <any>{},
	}
})()

if (!(window as any).entcore) {
	;(window as any).entcore = {}
}
;(window as any).entcore.Behaviours = Behaviours
;(window as any).Behaviours = Behaviours
