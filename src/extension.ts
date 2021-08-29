import { env } from "process"
import { commands, ExtensionContext, Position, Uri, window, workspace, WorkspaceEdit } from "vscode"
import { askEnteringProfileName, askPickingFileUris, readDocument } from "./helpers"

type Profiles = Record<string, string[]>

export function activate(context: ExtensionContext) {
	context.globalState.setKeysForSync(["profiles"])
	const getProfiles = () => context.globalState.get<Profiles>("profiles")

	async function saveProfile() {
		const profileName = await askEnteringProfileName()
		const fileUris = await askPickingFileUris()

		await context.globalState.update("profiles", {
			...getProfiles(),
			[profileName.toLowerCase()]: fileUris?.map(readDocument)
		})

		window.showInformationMessage(`Profile "${profileName}" saved`)
	}

	async function loadProfile() {
		const profiles = getProfiles() || {}
		const profileKeys = Object.keys(profiles).map(key => key.toUpperCase())

		if (profileKeys.length === 0) {
			window.showErrorMessage("No profiles to load")
			return
		}

		const profile = (await window.showQuickPick(profileKeys))?.toLowerCase()

		if (profile && profiles) {
			const configs = profiles[profile]

			await commands.executeCommand("copyFilePath")
			const folder = await env?.clipboard || workspace.workspaceFolders?.[0].uri
			const workSpaceEdit = new WorkspaceEdit

			let a = 0
			console.log(configs);

			configs.forEach(async config => {
				const uri = await Uri.file(folder + "/" + a++ + ".txt")
				console.log(uri, config)

				workSpaceEdit.createFile(uri, {
					// ignoreIfExists: true,
					overwrite: true
				})
				workSpaceEdit.insert(uri, new Position(0, 0), config)
			})
		}
	}

	context.subscriptions.push(
		commands.registerCommand('configs-profiler.saveProfile', saveProfile),
		commands.registerCommand('configs-profiler.loadProfile', loadProfile),
	)
}

// this method is called when your extension is deactivated
export function deactivate() { }
