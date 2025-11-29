export class Request<T> {
    data?: T;
    processId?: string;

    constructor(data: Partial<Request<T>>) {
        Object.assign(this, data);
    }
}

export type RequestType<T> = Request<T>;
