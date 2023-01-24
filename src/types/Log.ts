export type Log = {
    level: string;
    date: string;
    time: string;
    file: string;
    line: string;
    message: string;
    server_name: string;
    // TODO
    // Add more properties to avoid error when translating from pocketbase data to this
}