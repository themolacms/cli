import {HelperService} from './services/helper.service';
import {FileService} from './services/file.service';
import {DownloadService} from './services/download.service';
import {CreateService} from './services/create.service';

export class Lib {
  public readonly helperService: HelperService;
  public readonly fileService: FileService;
  public readonly downloadService: DownloadService;
  public readonly createService: CreateService;

  constructor() {
    this.helperService = new HelperService();
    this.fileService = new FileService();
    this.downloadService = new DownloadService();
    this.createService = new CreateService(
      this.helperService,
      this.fileService,
      this.downloadService
    );
  }
}
