import { injectable } from 'inversify';

export type HttpRequest = {
    method: string
    url: string
    headers?: { [key: string]: string }
    body?: string
};

export type HttpResponse = {
    readonly status: number
    readonly url: string
    readonly headers: { [key: string]: string }
    readonly body: string
};

export type HttpQueryParams = {
    [key: string]: any
}

export type HttpBodyAppender = (req: HttpRequest, data?: any) => void;

export type HttpHandler = (req: HttpRequest) => Promise<HttpResponse>
export type HttpMiddleware = (req: HttpRequest, next: HttpHandler) => Promise<HttpResponse>;

export const JsonBodyAppender: HttpBodyAppender = (req, data) => {
    const headers = req.headers || (req.headers = {});
    headers['Content-Type'] = 'application/json; charset=utf-8';
    
    if (typeof(data) !== 'undefined')
        req.body = JSON.stringify(data);
};

export const FormDataBodyAppender: HttpBodyAppender = (req, data) => {
    const headers = req.headers || (req.headers = {});
    headers['Content-Type'] = 'application/json; charset=utf-8';

    if (typeof(data) !== 'undefined')
        req.body = createQueryString(data);
};

export interface IHttpClient {
    use(middleware: HttpMiddleware) : IHttpClient;
    send(req: HttpRequest) : Promise<HttpResponse>;
    get(url: string, params?: HttpQueryParams) : Promise<HttpResponse>;
    delete(url: string, params?: HttpQueryParams) : Promise<HttpResponse>;
    post(url: string, data?: any, params?: HttpQueryParams) : Promise<HttpResponse>
    patch(url: string, data?: any, params?: HttpQueryParams) : Promise<HttpResponse>
    put(url: string, data?: any, params?: HttpQueryParams) : Promise<HttpResponse>
}

@injectable()
export class HttpClient implements IHttpClient {
    private $middleware: HttpMiddleware[] = [];
    private $pipeline: HttpHandler = req => this.$send(req);

    use(middleware: HttpMiddleware) {
        this.$middleware.push(middleware);

        // Reconstruct the pipeline
        let pipeline: HttpHandler = req => this.$send(req);

        for(let i = this.$middleware.length; i > 0; --i) {
            const next = pipeline;
            const middleware = this.$middleware[i - 1];
            pipeline = req => middleware(req, next);
        }

        this.$pipeline = pipeline;
        return this;
    }

    send(req: HttpRequest) {
        return this.$pipeline(req);
    }

    get(url: string, params?: HttpQueryParams) {
        return this.$pipeline(createRequest('GET', url, params));
    }  

    post(url: string, data?: any, params?: HttpQueryParams) {
        const req = { method: 'POST', url: appendParams(url, params), headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
        return this.$pipeline(req);
    }

    delete(url: string, params?: HttpQueryParams) {
        const req: HttpRequest = { method: 'DELETE', url: appendParams(url, params), headers: {} };
        return this.$pipeline(req);
    }  

    patch(url: string, data?: any, params?: HttpQueryParams) {
        const req = { 
            method: 'PATCH', 
            url: appendParams(url, params), 
            headers: { 'Content-Type': 'application/json' }, 
            body: typeof(data) !== JSON.stringify(data) 
        };
        return this.$pipeline(req);
    }

    put(url: string, data?: any, params?: HttpQueryParams) {
        const req = { method: 'PUT', url: appendParams(url, params), headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
        return this.$pipeline(req);
    }

    async $send(req: HttpRequest) : Promise<HttpResponse> {
        const res = await fetch(req.url, req);
        const headers: { [key: string]: string; } = {};

        res.headers.forEach((value, name) => headers[name] = value);

        return {
            status: res.status,
            headers: headers,
            url: res.url,
            body: await res.text()
        };
    }
}

function createRequest(method: string, url: string, params?: HttpQueryParams) : HttpRequest {
    if (typeof(params) !== 'undefined')
        url += (url.indexOf('?') >= 0 ? '&' : '?') + createQueryString(params);

    return {
        method,
        url,
        headers: {}
    };
}

function createBodyRequest(method: string, url: string, params?: HttpQueryParams, body?: any) : HttpRequest {
    const req = createRequest(method, url, params)
}

function appendParams(url: string, params?: HttpQueryParams) {
    if (typeof(params) !== 'undefined')
        url += (url.indexOf('?') >= 0 ? '&' : '?') + createQueryString(params)
    return url;
}

function createQueryString(params: HttpQueryParams) {
    return Object.keys(params)
        .filter(k => typeof(params[k]) !== 'undefined')
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k].toString())}`)
        .join('&');
}