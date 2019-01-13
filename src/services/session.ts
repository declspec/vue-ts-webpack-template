import { injectable } from 'inversify';
import { StorageService } from './storage';
import { IRestClient } from './rest-client';

const StorageKey = 'app-user';

@injectable()
export class SessionService<TUser> {
    private storageService: StorageService;
    private restClient: IRestClient;

    public constructor(restClient: IRestClient, storageService: StorageService) {
        this.restClient = restClient;
        this.storageService = storageService;
    }

    current(): TUser | null {
        return this.storageService.get<TUser>(StorageKey) || null;
    }

    fetch(): Promise<TUser | null> {
        return this.restClient.get<TUser>(`/sessions`)
            .then(res => res.data || null);
    }

    clear() {
        this.storageService.clear();
    }

    login(credentials: any): Promise<TUser | null> {
        return this.restClient.post<TUser>(`/sessions`, credentials).then(res => {
            if (res.data)
                this.storageService.set(StorageKey, res.data);
            return res.data || null;
        });
    }

    logout() {
        return this.restClient.delete(`/sessions`)
            .then(() => this.clear());
    }

    refresh(): Promise<TUser | null> {
        return Promise.resolve(null);
    }
}