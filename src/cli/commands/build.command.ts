import {TerminalService} from '../../lib/services/terminal.service';

export class BuildCommand {
  constructor(private terminalService: TerminalService) {}

  run() {
    this.terminalService.exec('npm run build', '.', 'inherit');
  }
}
