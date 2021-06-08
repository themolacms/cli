import {HelperService} from './services/helper.service';
import {MessageService} from './services/message.service';
import {FileService} from './services/file.service';
import {DownloadService} from './services/download.service';
import {TerminalService} from './services/terminal.service';
import {ProjectService} from './services/project.service';
import {FirebaseService} from './services/firebase.service';

export class Lib {
  public readonly helperService: HelperService;
  public readonly messageService: MessageService;
  public readonly fileService: FileService;
  public readonly downloadService: DownloadService;
  public readonly terminalService: TerminalService;
  public readonly projectService: ProjectService;
  public readonly firebaseService: FirebaseService;

  constructor() {
    this.helperService = new HelperService();
    this.messageService = new MessageService();
    this.fileService = new FileService();
    this.downloadService = new DownloadService();
    this.terminalService = new TerminalService();
    this.projectService = new ProjectService(this.fileService);
    this.firebaseService = new FirebaseService(this.fileService);
  }
}
