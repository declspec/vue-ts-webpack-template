import { injectable } from 'inversify';

import { 
    jsonContent, 
    IHttpClient, 
    HttpQueryParams, 
    HttpResponse
} from './http-client';

export type RestResponse<T = any> = {
    status: number
    data?: T
    errors: Array<string>
};

export interface IRestClient {
    get<T = any>(url: string, params?: HttpQueryParams) : Promise<RestResponse<T>>;
    delete<T = any>(url: string, params?: HttpQueryParams) : Promise<RestResponse<T>>;
    post<T = any>(url: string, data?: any, params?: HttpQueryParams) : Promise<RestResponse<T>>
    patch<T = any>(url: string, data?: any, params?: HttpQueryParams) : Promise<RestResponse<T>>
    put<T = any>(url: string, data?: any, params?: HttpQueryParams) : Promise<RestResponse<T>>
}

@injectable()
export class RestClient implements IRestClient {
    private readonly httpClient: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient;
    }

    get<T = any>(url: string, params?: HttpQueryParams): Promise<RestResponse<T>> {
        return this.httpClient.get(url, params).then(handleResponse);
    }

    delete<T = any>(url: string, params?: HttpQueryParams): Promise<RestResponse<T>> {
        return this.httpClient.delete(url, params).then(handleResponse);
    }

    post<T = any>(url: string, data?: any, params?: HttpQueryParams): Promise<RestResponse<T>> {
        return this.httpClient.post(url, jsonContent(data), params).then(handleResponse);
    }

    patch<T = any>(url: string, data?: any, params?: HttpQueryParams): Promise<RestResponse<T>> {
        return this.httpClient.patch(url, jsonContent(data), params).then(handleResponse);
    }

    put<T = any>(url: string, data?: any, params?: HttpQueryParams): Promise<RestResponse<T>> {
        return this.httpClient.put(url, jsonContent(data), params).then(handleResponse);
    }
}

function handleResponse<T = any>(res: HttpResponse) : RestResponse<T> | Promise<RestResponse<T>> {
    const contentType = res.headers['content-type'];
    if (typeof(contentType) !== 'string' || contentType.indexOf('application/json') !== 0)
        throw new Error(`Invalid "Content-Type" header returned from server; expected "application/json", got "${contentType || 'undefined'}"`);

    const body: RestResponse<T> = JSON.parse(res.body);

    if (body.status < 500)
        return body;

    // Unhandled structured response from the server
    const error = new Error(`${res.request.method} "${res.request.url}" ${body.status} (${body.errors.join('; ')})`);
    error.name = 'RestClientUnhandledResponseError';
    (<any> error).response = body;

    return Promise.reject(error);
}