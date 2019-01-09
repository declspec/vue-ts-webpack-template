import { Container } from 'inversify';
import { IHttp, Http } from '../services/http';

const container = new Container();
container.bind<IHttp>('IHttp').to(Http);

export default container;