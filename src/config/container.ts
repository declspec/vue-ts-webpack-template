import { Container } from 'inversify';
import { IHttp, Http } from '../services/http';
import { StorageService } from '../services/storage';

const container = new Container();
container.bind<IHttp>('IHttp').to(Http);
container.bind<StorageService>('StorageService').toConstantValue(new StorageService(window.localStorage));

export default container;