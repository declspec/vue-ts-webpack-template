import { injectable } from 'inversify';
import { StorageService } from './storage';
import { IHttp } from './http';

const StorageKey = 'app-user';

@injectable()
export class SessionService<TUser> {
    private storageService: StorageService;
    private http: IHttp;

    public constructor(http: IHttp, storageService: StorageService) {
        this.http = http;
        this.storageService = storageService;
    }

    current() {
        return this.storageService.get<TUser>(StorageKey) || null;
    }

    fetch() {
        return this.http.get(`/sess
    }
}