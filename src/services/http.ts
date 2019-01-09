import { injectable } from 'inversify';

export type HttpRequest = {
    method: string;
    url: string;
    headers?: { [key: string]: string };
    body?: string;
};

export type HttpResponse = {
    status: number;
    url: string;
    headers: { [key: string]: string };
    body?: any;
};

export type QueryParams = {
    [key: string]: any
}

export type HttpHandler = (req: HttpRequest) => Promise<HttpResponse>
export type HttpMiddleware = (req: HttpRequest, next: HttpHandler) => Promise<HttpResponse>;

export interface IHttp {
    use(middleware: HttpMiddleware) : IHttp;
    send(req: HttpRequest) : Promise<HttpResponse>;
    get(url: string, params?: QueryParams) : Promise<HttpResponse>;
    delete(url: string, params?: QueryParams) : Promise<HttpResponse>;
    post(url: string, data?: any, params?: QueryParams) : Promise<HttpResponse>
    patch(url: string, data?: any, params?: QueryParams) : Promise<HttpResponse>
    put(url: string, data?: any, params?: QueryParams) : Promise<HttpResponse>
}

@injectable()
export class Http implements IHttp {
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

    get(url: string, params?: QueryParams) {
        const req: HttpRequest = { method: 'GET', url: appendParams(url, params), headers: {} };
        return this.$pipeline(req);
    }  

    post(url: string, data?: any, params?: QueryParams) {
        const req = { method: 'POST', url: appendParams(url, params), headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
        return this.$pipeline(req);
    }

    delete(url: string, params?: QueryParams) {
        const req: HttpRequest = { method: 'DELETE', url: appendParams(url, params), headers: {} };
        return this.$pipeline(req);
    }  

    patch(url: string, data?: any, params?: QueryParams) {
        const req = { method: 'PATCH', url: appendParams(url, params), headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
        return this.$pipeline(req);
    }

    put(url: string, data?: any, params?: QueryParams) {
        const req = { method: 'PUT', url: appendParams(url, params), headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
        return this.$pipeline(req);
    }

    $send(req: HttpRequest) : Promise<HttpResponse> {
        return fetch(req.url, req).then(res => {
            const headers: { [key: string]: string } = {};

            res.headers.forEach((value, name) => headers[name] = value);

            const response: HttpResponse = {
                status: res.status,
                headers: headers,
                url: res.url
            };

            const contentType = res.headers.get('Content-Type');
            const readBody: Promise<any> = (typeof(contentType) === 'string' && contentType.indexOf('json') >= 0 ? res.json() : res.text());

            return readBody.then(body => {
                response.body = body;
                return response;
            })
        })
    }
}

function appendParams(url: string, params?: QueryParams) {
    if (typeof(params) !== 'undefined')
        url += (url.indexOf('?') >= 0 ? '&' : '?') + createQueryString(params)
    return url;
}

function createQueryString(params: QueryParams) {
    return Object.keys(params)
        .filter(k => typeof(params[k]) !== 'undefined')
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k].toString())}`)
        .join('&');
}