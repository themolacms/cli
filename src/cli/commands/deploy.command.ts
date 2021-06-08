import {TerminalService} from '../../lib/services/terminal.service';

export class DeployCommand {
  constructor(private terminalService: TerminalService) {}

  run() {
    this.terminalService.exec('npm run deploy', '.', 'inherit');
  }
}
