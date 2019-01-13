import { Container } from 'inversify';
import { IHttpClient, HttpClient } from '../services/http-client';
import { IRestClient, RestClient } from '../services/rest-client';
import { StorageService } from '../services/storage';

const container = new Container();
container.bind<IHttpClient>('IHttpClient').to(HttpClient);
container.bind<IRestClient>('IRestClient').to(RestClient);
container.bind<StorageService>('StorageService').toConstantValue(new StorageService(window.localStorage));

export default container;