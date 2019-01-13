import { 
    jsonContent, 
    IHttpClient, 
    HttpQueryParams, 
    HttpResponse
} from './http-client';

export type RestResponse<T = any> = {
    status: number
    data?: T
    errors: Array<string | Error>
};

export interface IRestClient {
    get<T = any>(url: string, params?: HttpQueryParams) : Promise<RestResponse<T>>;
    delete<T = any>(url: string, params?: HttpQueryParams) : Promise<RestResponse<T>>;
    post<T = any>(url: string, data?: any, params?: HttpQueryParams) : Promise<RestResponse<T>>
    patch<T = any>(url: string, data?: any, params?: HttpQueryParams) : Promise<RestResponse<T>>
    put<T = any>(url: string, data?: any, params?: HttpQueryParams) : Promise<RestResponse<T>>
}

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

function handleResponse<T = any>(res: HttpResponse) : RestResponse<T> {
    const contentType = res.headers['content-type'];
    if (typeof(contentType) !== 'string' || contentType.indexOf('application/json') !== 0)
        throw new Error(`Invalid "Content-Type" header returned from server; expected "application/json", got "${contentType || 'undefined'}"`);

    return JSON.parse(res.body);
}