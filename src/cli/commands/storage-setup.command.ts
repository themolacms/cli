import {OK} from '../../lib/services/message.service';
import {TerminalService} from '../../lib/services/terminal.service';

export class StorageSetupCommand {
  constructor(private terminalService: TerminalService) {}

  async run() {
    // deploy rules, indexes
    this.terminalService.exec(
      'npx firebase deploy --only storage',
      'firebase',
      'inherit'
    );
    return console.log(OK + 'Storage setup completed!');
  }
}
