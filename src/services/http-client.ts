import { injectable } from 'inversify';

export type HttpRequest = {
    method: string
    url: string
    headers?: { [key: string]: string }
    body?: string
};

export type HttpResponse = {
    readonly request: HttpRequest
    readonly status: number
    readonly url: string
    readonly headers: { [key: string]: string }
    readonly body: string
};

export type HttpContent = {
    contentType: string
    body: string
};

export type HttpQueryParams = {
    [key: string]: any
};

export type HttpHandler = (req: HttpRequest) => Promise<HttpResponse>
export type HttpMiddleware = (req: HttpRequest, next: HttpHandler) => Promise<HttpResponse>;

export const jsonContent = (data: any): HttpContent => {
    return {
        contentType: 'application/json; charset=utf-8',
        body: JSON.stringify(data)
    };
}

export const formDataContent = (data: any): HttpContent => {
    return {
        contentType: 'application/x-www-form-urlencoded',
        body: createQueryString(data)
    };
};

export interface IHttpClient {
    use(middleware: HttpMiddleware) : IHttpClient;
    send(req: HttpRequest) : Promise<HttpResponse>;
    get(url: string, params?: HttpQueryParams) : Promise<HttpResponse>;
    delete(url: string, params?: HttpQueryParams) : Promise<HttpResponse>;
    post(url: string, content?: HttpContent, params?: HttpQueryParams) : Promise<HttpResponse>
    patch(url: string, content?: HttpContent, params?: HttpQueryParams) : Promise<HttpResponse>
    put(url: string, content?: HttpContent, params?: HttpQueryParams) : Promise<HttpResponse>
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

    post(url: string, content?: HttpContent, params?: HttpQueryParams) {
        return this.$pipeline(createRequest('POST', url, params, content));
    }

    delete(url: string, params?: HttpQueryParams) {
        return this.$pipeline(createRequest('DELETE', url, params));
    }  

    patch(url: string, content?: HttpContent, params?: HttpQueryParams) {
        return this.$pipeline(createRequest('PATCH', url, params, content));
    }

    put(url: string, content?: HttpContent, params?: HttpQueryParams) {
        return this.$pipeline(createRequest('PUT', url, params, content));
    }

    private async $send(req: HttpRequest) : Promise<HttpResponse> {
        const res = await fetch(req.url, req);
        const headers: { [key: string]: string; } = {};

        res.headers.forEach((value, name) => headers[name] = value);

        return {
            request: req,
            status: res.status,
            headers: headers,
            url: res.url,
            body: await res.text()
        };
    }
}

function createRequest(method: string, url: string, params?: HttpQueryParams, content?: HttpContent) : HttpRequest {
    if (typeof(params) !== 'undefined')
        url += (url.indexOf('?') >= 0 ? '&' : '?') + createQueryString(params);

    return {
        method,
        url,
        headers: content ? { 'Content-Type': content.contentType } : undefined,
        body: content ? content.body : undefined
    };
}

function createQueryString(params: HttpQueryParams) {
    return Object.keys(params)
        .filter(k => typeof(params[k]) !== 'undefined')
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k].toString())}`)
        .join('&');
}