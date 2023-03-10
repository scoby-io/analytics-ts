export interface PageView {
    ipAddress: string;
    userAgent: string;
    requestedUrl: string;
    visitorId?: string;
    referringUrl?: string;
}
export declare class Client {
    private apiKey;
    private readonly salt;
    private readonly jarId;
    private readonly apiHost;
    constructor(apiKey: string, salt: string);
    private hash;
    private getVisitorId;
    private getJarId;
    logPageView(pageView: PageView): Promise<boolean>;
}
//# sourceMappingURL=index.d.ts.map