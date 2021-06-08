import {TerminalService} from '../../lib/services/terminal.service';

export class E2eCommand {
  constructor(private terminalService: TerminalService) {}

  run() {
    this.terminalService.exec('npm run e2e', '.', 'inherit');
  }
}
