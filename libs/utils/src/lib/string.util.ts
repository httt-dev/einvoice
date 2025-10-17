import { v7 } from 'uuid';

export const getProcessId = (prefix?: string) => {
    return `${prefix ? prefix + '-' : ''}${v7()}`;
};
