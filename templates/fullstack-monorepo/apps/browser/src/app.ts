import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Browser extension is now active!');
  
  const disposable = vscode.commands.registerCommand('browser.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from Browser Extension!');
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
