export interface PageView {
    ipAddress: string;
    userAgent: string;
    requestedUrl: string;
    visitorId?: string;
    referringUrl?: string;
}
export declare class Client {
    private jarId;
    private readonly apiHost;
    constructor(jarId: string);
    private hash;
    private getVisitorId;
    logPageView(pageView: PageView): Promise<boolean>;
}
//# sourceMappingURL=index.d.ts.map