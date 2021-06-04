import {FileService} from './services/file.service';
import {DownloadService} from './services/download.service';
import {CreateService} from './services/create.service';

export class Lib {
  fileService: FileService;
  downloadService: DownloadService;
  createService: CreateService;

  constructor() {
    this.fileService = new FileService();
    this.downloadService = new DownloadService();
    this.createService = new CreateService(
      this.fileService,
      this.downloadService
    );
  }
}
