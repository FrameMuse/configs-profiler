import { Uri, window, workspace } from "vscode"

export function askEnteringProfileName() {
  return new Promise<string>(resolve => {
    const inputBox = window.createInputBox()
    inputBox.placeholder = "Enter profile name"
    inputBox.onDidAccept(() => {
      resolve(inputBox.value)
      inputBox.hide()
    })
    inputBox.show()
  })
}

export function askPickingFileUris() {
  return new Promise<Uri[] | undefined>(resolve => {
    const defaultUri = workspace.workspaceFolders?.[0].uri

    window.showOpenDialog({
      title: "Select your configs",
      defaultUri,
      canSelectMany: true,
      canSelectFiles: true,
    }).then(resolve)
  })
}

export function readDocument(uri: Uri) {
  return new Promise<string>(resolve => {
    workspace
      .openTextDocument(uri)
      .then((document) => {
        resolve(document.getText())
      })
  })
}